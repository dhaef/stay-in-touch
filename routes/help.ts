import { Router, Request, Response } from 'express';
import { sendEmail } from '../utils/send-email';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, message, subject = 'Help' } = req.body;
  const msg = `From: ${email}<br />${message}`;
  try {
    const result = await sendEmail(process.env.HELP_EMAIL, msg, subject);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

module.exports = router;
