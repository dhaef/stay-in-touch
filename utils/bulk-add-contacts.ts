import csv from 'csvtojson';
import { create } from '../db/contacts';
import { updateContactsCount } from '../db/users';
import { checkSubscription } from './stripe';

export const contactLimit = 50;

export const bulkAddContacts = async (
  userId,
  file,
  contactsCount = 0,
  stripeSubscriptionId
) => {
  try {
    const contacts = await csv().fromString(file.data.toString());
    console.log(contacts);

    if (contacts?.length + contactsCount > contactLimit) {
      const auth = await checkSubscription(stripeSubscriptionId);
      if (!auth) {
        return `contacts limit reached`;
      }
    }

    const created = await Promise.all(
      contacts.map(
        async (c) =>
          await create({
            userId,
            notes: c?.notes,
            frequency: c?.frequency,
            frequencyType: c['frequency type'],
            name: c?.name,
            contactInfo: c['contact info'],
          })
      )
    );

    await updateContactsCount(userId, contactsCount + created?.length);
    return {
      total: created?.length,
      created,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
