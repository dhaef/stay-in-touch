import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// const forceSsl = require('force-ssl-heroku');
// import rateLimit from 'express-rate-limit';
import path from 'path';
import { create } from './db/users';
import fileupload from 'express-fileupload';

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

app.post('/test', async (req: Request, res: Response) => {
  await create({
    poolId: 'us-east-1_pU1SZ0t8M',
    email: 'blah',
    userSub: '516fb690-eb1e-4677-ae6c-aded5a249316',
  });
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
