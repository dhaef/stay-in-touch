import { Router, Request, Response } from 'express';
import { create, setSettings, getUser } from '../db/users';
import { authUser, UserRequest } from '../middleware/auth';

const router = Router();

router.put('/', async (req: Request, res: Response) => {
  const { email, poolId, userSub } = req.body;
  try {
    const user = await create({ email, poolId, userSub });
    console.log(user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

router.put('/settings', authUser, async (req: UserRequest, res: Response) => {
  const { reminderTime, isEmailEnabled } = req.body;
  const { id } = req.user;
  try {
    const user = await setSettings(id, reminderTime, isEmailEnabled);
    console.log(user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

router.get('/', authUser, async (req: UserRequest, res: Response) => {
  const { id } = req.user;

  try {
    const user = await getUser(id);
    console.log(user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

module.exports = router;
