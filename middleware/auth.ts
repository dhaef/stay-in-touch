import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { getUser, User } from '../db/users';
import { Response, NextFunction, Request } from 'express';

export interface UserRequest extends Request {
  user: User;
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID, // mandatory, can't be overridden upon calling verify
  tokenUse: 'id', // needs to be specified here or upon calling verify
  clientId: process.env.AWS_COGNITO_CLIENT_ID, // needs to be specified here or upon calling verify
});

export async function authUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token.' });
  }

  try {
    const decoded = await verifier.verify(token);

    const user = await getUser(decoded?.sub);
    req.user = user;

    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: 'Token is invalid.' });
  }
}
