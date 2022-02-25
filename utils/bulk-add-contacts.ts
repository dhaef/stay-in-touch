import csv from 'csvtojson';
import { create } from '../db/contacts';

export const bulkAddContacts = async (userId, file) => {
  try {
    const contacts = await csv().fromString(file.data.toString());
    console.log(contacts);

    // if (contacts?.length >= 500) {
    //     throw new Error(`too many items`);
    // }

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

    return {
      total: created?.length,
      created,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
