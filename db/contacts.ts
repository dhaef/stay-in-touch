import { client } from './client';
import { v4 as uuidv4 } from 'uuid';
import { getFrequencyType } from '../utils/contact';
import { removeDbItems } from '../utils/db';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const tableName = 'stay-in-touch';

export interface EstablishedContact {
  id: string;
  userId: string;
  name: string;
  contactInfo?: string;
  notes?: string;
  frequency: number;
  frequencyType: string;
  lastContact?: string;
  nextContact?: string;
  createdAt?: string;
}

export interface CreateEstablishedContactInput {
  userId: string;
  name: string;
  contactInfo?: string;
  notes?: string;
  frequency: number;
  frequencyType: string;
  lastContact?: string;
  id?: string;
}

export const getNextContact = (frequency, frequencyType) =>
  dayjs().utc().add(frequency, getFrequencyType(frequencyType)).unix();

export const create = async (
  args: CreateEstablishedContactInput
): Promise<EstablishedContact> => {
  const { userId, frequency, frequencyType } = args;
  const id = args?.id || uuidv4();
  const nextContact = getNextContact(frequency, frequencyType);

  const dbItem = {
    id,
    pk: `EstablishedContact|User|${userId}`,
    sk: `EstablishedContact|${id}`,
    gsiOnePk: `EstablishedContact`,
    gsiOneSk: nextContact,
    nextContact,
    createdAt: dayjs().utc().toISOString(),
    ...args,
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

export const remove = async (userId: string, id: string) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `EstablishedContact|User|${userId}`,
      sk: `EstablishedContact|${id}`,
    },
  };

  const { Item }: any = await client.delete(params).promise();
  return Item;
};

export const contactsByUserId = async (
  userId: string,
  options?: { nextKey?: any; limit?: number }
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': `EstablishedContact|User|${userId}`,
    },
    ExclusiveStartKey: options?.nextKey,
    Limit: options?.limit,
  };

  try {
    const { Items, LastEvaluatedKey } = await client.query(params).promise();

    return {
      contacts: Items.map((i) => removeDbItems(i)) || [],
      nextKey: LastEvaluatedKey,
    };
  } catch (error) {
    console.log(error);
  }
};

export const contactsById = async (userId: string, id: string) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `EstablishedContact|User|${userId}`,
      sk: `EstablishedContact|${id}`,
    },
  };

  try {
    const { Item } = await client.get(params).promise();

    return removeDbItems(Item);
  } catch (error) {
    console.log(error);
  }
};

export const nextContacts = async (args: { now: number; then: number }) => {
  const { now, then } = args;

  const params = {
    TableName: tableName,
    IndexName: 'One',
    KeyConditionExpression: '#pk = :pk AND gsiOneSk BETWEEN :a AND :b',
    ExpressionAttributeValues: {
      ':pk': `EstablishedContact`,
      ':a': now,
      ':b': then,
    },
    ExpressionAttributeNames: {
      '#pk': `gsiOnePk`,
    },
  };

  try {
    const { Items } = await client.query(params).promise();
    const items = Items.map((i) => removeDbItems(i));

    return items;
  } catch (error) {
    console.log(error);
  }
};

export const updateContact = async (
  userId: string,
  id: string,
  nextContact: number,
  lastContact: number
) => {
  const params = {
    TableName: tableName,
    Key: {
      pk: `EstablishedContact|User|${userId}`,
      sk: `EstablishedContact|${id}`,
    },
    UpdateExpression: `
      SET lastContact=:lastContact,
          nextContact=:nextContact,
          gsiOneSk=:nextContact
    `,
    ExpressionAttributeValues: {
      ':lastContact': lastContact,
      ':nextContact': nextContact,
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response.Attributes;
};

export const update = async (args: {
  userId: string;
  id: string;
  nextContact: number;
  lastContact: number;
  name: string;
  frequency: number;
  frequencyType: string;
  notes?: string;
  contactInfo?: string;
}) => {
  const {
    userId,
    id,
    nextContact,
    lastContact,
    name,
    frequency,
    frequencyType,
    notes,
    contactInfo,
  } = args;

  const updateExpression: any = [
    'lastContact=:lastContact',
    'nextContact=:nextContact',
    'gsiOneSk=:nextContact',
    '#n=:n',
    'frequency=:frequency',
    'frequencyType=:frequencyType',
  ];
  const ExpressionAttributeValues = {
    ':lastContact': lastContact,
    ':nextContact': nextContact,
    ':n': name,
    ':frequency': frequency,
    ':frequencyType': frequencyType,
  };

  if (notes) {
    updateExpression.push(`notes=:notes`);
    ExpressionAttributeValues[':notes'] = notes;
  }

  if (contactInfo) {
    updateExpression.push(`contactInfo=:contactInfo`);
    ExpressionAttributeValues[':contactInfo'] = contactInfo;
  }

  const params = {
    TableName: tableName,
    Key: {
      pk: `EstablishedContact|User|${userId}`,
      sk: `EstablishedContact|${id}`,
    },
    UpdateExpression: `SET ${updateExpression.join(',')}`,
    ExpressionAttributeValues,
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await client.update(params).promise();
  console.log(response);
  return response.Attributes;
};
