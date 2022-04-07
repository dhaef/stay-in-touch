import { client } from './client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { removeDbItems } from '../utils/db';

dayjs.extend(utc);

const tableName = 'stay-in-touch';

export interface User {
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  superUser?: boolean;
  isEmailEnabled?: boolean;
  email: string;
  id: string;
  poolId: string;
  reminderTime: number;
  contactsCount: number;
}

export const create = async ({ email, poolId, userSub }) => {
  const dbItem = {
    id: userSub,
    email,
    poolId,
    reminderTime: 0,
    contactsCount: 0,
    createdAt: dayjs().utc().toISOString(),
    pk: `User|${userSub}`,
    sk: `User`,
  };
  const params = {
    TableName: tableName,
    Item: dbItem,
  };

  try {
    await client.put(params).promise();
    return removeDbItems(dbItem);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (id: string): Promise<User> => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${id}`,
      sk: 'User',
    },
  };

  const { Item } = await client.get(params).promise();
  return removeDbItems(Item) as User;
};

export const remove = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${id}`,
      sk: 'User',
    },
  };

  const { Item }: any = await client.delete(params).promise();
  return Item;
};

export const setSettings = async (
  userId: string,
  reminderTime: number,
  isEmailEnabled?: boolean
) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${userId}`,
      sk: 'User',
    },
    UpdateExpression: `
      SET reminderTime=:reminderTime,
          isEmailEnabled=:isEmailEnabled
    `,
    ExpressionAttributeValues: {
      ':reminderTime': reminderTime,
      ':isEmailEnabled': isEmailEnabled,
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response.Attributes;
};

export const updateContactsCount = async (
  userId: string,
  contactsCount: number
) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${userId}`,
      sk: 'User',
    },
    UpdateExpression: `
      SET contactsCount=:contactsCount
    `,
    ExpressionAttributeValues: {
      ':contactsCount': contactsCount,
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response.Attributes;
};

export const stripeUpdate = async (userId, customerId, subscriptionId) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${userId}`,
      sk: 'User',
    },
    UpdateExpression: `
      SET stripeCustomerId=:stripeCustomerId,
      stripeSubscriptionId=:stripeSubscriptionId
    `,
    ExpressionAttributeValues: {
      ':stripeCustomerId': customerId,
      ':stripeSubscriptionId': subscriptionId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response;
};
