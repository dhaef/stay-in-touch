import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_luteKmIh6',
  ClientId: '3uakaj2i0l2864v1h4vvmujeth',
};

export default new CognitoUserPool(poolData);
