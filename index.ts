import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// const forceSsl = require('force-ssl-heroku');
// import rateLimit from 'express-rate-limit';
import path from 'path';
import fileupload from 'express-fileupload';
import { findContacts } from './utils/find-contacts';

const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();
// app.use(forceSsl);

// app.set('trust proxy', 1);
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 150, // limit each IP to 100 requests per windowMs
// });

//  apply to all requests
// app.use(limiter);

app.use(bodyParser.json());
app.use(fileupload());

app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/help', require('./routes/help'));
app.use('/api/stripe', require('./routes/stripe'));

app.get('/test/:hour', async (req: Request, res: Response) => {
  const { hour } = req.params;
  console.log(`HERERERE`, hour);
  await findContacts(+hour);
  res.status(200).json({ test: 'success' });
});

// REACT BUILD PRODUCTION
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req: Request, res: Response) => {
    const myPath = path.join('/app', 'client', 'build', 'index.html');
    // const myPath = path.join(__dirname, 'client', 'build', 'index.html');
    console.log(myPath);
    res.sendFile(myPath);
  });
}

app.listen(port, () => console.log(`Server started on port:${port}`));
