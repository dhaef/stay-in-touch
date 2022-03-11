import { Router, Request, Response } from 'express';
import {
  create,
  remove,
  contactsByUserId,
  contactsById,
  nextContacts,
} from '../db/contacts';
import { findContacts } from '../utils/find-contacts';
import { authUser, UserRequest } from '../middleware/auth';
import { bulkAddContacts, contactLimit } from '../utils/bulk-add-contacts';
import { updateContactsCount } from '../db/users';
import { checkSubscription } from '../utils/stripe';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const router = Router();

router.post('/bulk', authUser, async (req: any, res: Response) => {
  const { id: userId, contactsCount } = req.user;

  try {
    const contacts = await bulkAddContacts(
      userId,
      req.files.file,
      contactsCount,
      req.user?.stripeSubscriptionId
    );
    console.log(contacts);
    if (contacts === 'contacts limit reached') {
      return res
        .status(400)
        .json({ msg: 'contacts limit reached', contactsCount });
    }

    res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.post('/', authUser, async (req: UserRequest, res: Response) => {
  const {
    name,
    frequency: { frequencyType, frequency },
    notes,
    contactInfo,
  } = req.body;
  const { id: userId, contactsCount = 0 } = req.user;
  try {
    if (contactsCount + 1 > contactLimit) {
      const auth = await checkSubscription(req.user?.stripeSubscriptionId);
      if (!auth) {
        return res
          .status(400)
          .json({ msg: 'contacts limit reached', contactsCount });
      }
    }

    const contact = await create({
      userId,
      name,
      frequency,
      frequencyType,
      notes,
      contactInfo,
    });
    await updateContactsCount(userId, contactsCount + 1);
    res.status(200).json({ data: contact });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.get('/all', async (_req: Request, res: Response) => {
  try {
    //   get the real hour from the event
    const contacts = await findContacts(0);
    res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.post('/next', async (req: Request, res: Response) => {
  const { now, then } = req.body;
  // const now = dayjs().utc().add(1, 'day').startOf('day').unix();
  // const then = dayjs().utc().add(1, 'day').endOf('day').unix();
  try {
    const contacts = await nextContacts({ now, then });
    res.status(200).json({ data: contacts, count: contacts.length });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.post('/table', authUser, async (req: UserRequest, res: Response) => {
  const { id } = req.user;
  const { nextKey: key } = req.body;

  try {
    const { contacts, nextKey } = await contactsByUserId(id, {
      limit: 10,
      nextKey: key,
    });
    res.status(200).json({ data: { contacts, nextKey } });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.get('/:id', authUser, async (req: UserRequest, res: Response) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  try {
    const contacts = await contactsById(userId, id);
    res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

router.delete('/:id', authUser, async (req: UserRequest, res: Response) => {
  const { id: userId, contactsCount = 0 } = req.user;
  const { id } = req.params;

  try {
    const contact = await remove(userId, id);
    await updateContactsCount(userId, contactsCount - 1);

    res.status(200).json({ data: contact });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

module.exports = router;
