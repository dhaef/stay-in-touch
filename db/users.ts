import { client } from './client';
// import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { removeDbItems } from '../utils/db';

const tableName = 'stay-in-touch';

export interface User {
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  superUser?: boolean;
  email: string;
  id: string;
  poolId: string;
  reminderTime: number;
}

export const create = async ({ email, poolId, userSub }) => {
  const dbItem = {
    id: userSub,
    email,
    poolId,
    reminderTime: 0,
    createdAt: dayjs().toISOString(),
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

export const setReminderTime = async (userId: string, reminderTime: number) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `User|${userId}`,
      sk: 'User',
    },
    UpdateExpression: `
      SET reminderTime=:reminderTime
    `,
    ExpressionAttributeValues: {
      ':reminderTime': reminderTime,
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response.Attributes;
};
