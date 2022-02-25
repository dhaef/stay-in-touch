import { Router, Request, Response } from 'express';
import { create, remove, contactsByUserId, contactsById } from '../db/contacts';
import { findContacts } from '../utils/find-contacts';
import { authUser, UserRequest } from '../middleware/auth';
import { bulkAddContacts } from '../utils/bulk-add-contacts';

const router = Router();

router.post('/bulk', authUser, async (req: any, res: Response) => {
  const { id: userId } = req.user;

  try {
    const contacts = await bulkAddContacts(userId, req.files.file);
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
  const { id: userId } = req.user;
  try {
    const contact = await create({
      userId,
      name,
      frequency,
      frequencyType,
      notes,
      contactInfo,
    });
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
  const { id: userId } = req.user;
  const { id } = req.params;

  try {
    const contact = await remove(userId, id);

    res.status(200).json({ data: contact });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

module.exports = router;
