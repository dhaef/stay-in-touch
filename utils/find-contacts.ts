import {
  nextContacts,
  EstablishedContact,
  remove,
  create,
} from '../db/contacts';
import { getUser } from '../db/users';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { sendEmail } from './send-email';

dayjs.extend(utc);

const getLineItems = (contacts: EstablishedContact[]) => {
  let items = ``;

  contacts.map((contact) => {
    const info = contact?.contactInfo;
    const notes = contact?.notes;
    items += `
    <div style="margin: 8px 0; line-height: 1.6; background-color: #fafafa; padding: 5px; border-radius: 5px;">
      <div><span style="font-weight: 700;">${contact.name}</span> ${
      info ? `@${info}` : ''
    }</div>
      <div>${
        notes
          ? `<span style="font-weight: 700;">Notes:</span> ${contact?.notes}`
          : ''
      }</div>
    </div>
    `;
  });

  return items;
};

/* 

- Get all contacts that have a sk in the next 24 hours
- Check the time they want it sent? (every three hours?)
    - would have to get the users
- Send email for each user with contacts
- Delete contact and create a new one with the next contact time
    - Save the nextContact as lastContact on the new item

*/

export const findContacts = async (hour: number) => {
  const now = dayjs().utc().startOf('day').unix();
  const then = dayjs().utc().endOf('day').unix();
  console.log(`now`, now);
  console.log(`then`, then);
  //   get contacts for today
  const contacts: EstablishedContact[] = await nextContacts({ now, then });
  console.log(contacts);
  //   GROUP CONTACTS??
  const groupedContacts: { id: string; contacts: EstablishedContact[] }[] = [];
  contacts.forEach((c) => {
    const index = groupedContacts.findIndex((gc) => gc.id === c.userId);

    if (index >= 0) {
      groupedContacts[index].contacts.push(c);
    } else {
      groupedContacts.push({ id: c.userId, contacts: [c] });
    }
  });

  /*  check each user alert time.
        if so,
        write the email,
        send email,
        delete the record,
        create the next contact record
  */
  // const thisHourContacts = [...contacts];
  const contactsReadyToBeRecreated = [];

  const sent = await Promise.all(
    groupedContacts.map(async (gc) => {
      try {
        const user = await getUser(gc.id);

        const reminderTime = user?.reminderTime || 0;
        if (reminderTime === hour) {
          contactsReadyToBeRecreated.push(gc.contacts);
        } else {
          return;
        }
        // if (reminderTime !== hour) {
        //   const index = contacts.findIndex(
        //     (thc) => thc.userId === user.id
        //   );
        //   console.log(user.email, reminderTime, hour, index);
        //   if (index > -1) {
        //     contacts.splice(index, 1);
        //   }
        //   return;
        // }
        console.log(`Sending reminder for:`, gc.contacts);
        let msg = `
          <div style="text-align: center;">
              <h3>Hi!</h3>

              <h5 style="font-size: 1em;">Here’s who you should keep in touch with today:</h5>
              <div>${getLineItems(gc.contacts)}</div>

              <h6 style="font-size: 0.9em;">Happy reconnecting!</h6>
          </div>
        `;

        return await sendEmail(user.email, msg, `Keep In Touch Reminder!`);
      } catch (error) {
        console.log(error);
      }
    })
  );

  console.log(contactsReadyToBeRecreated.flat().map((f) => f.email));
  const created = await Promise.all(
    contactsReadyToBeRecreated.flat().map(async (cs) => {
      console.log(`Removing and creating: ${cs.name}|${cs.id}`);
      try {
        await remove(cs.userId, cs.id);
        return await create({
          id: cs.id,
          userId: cs.userId,
          lastContact: cs.nextContact,
          name: cs.name,
          frequency: cs.frequency,
          frequencyType: cs.frequencyType,
          contactInfo: cs?.contactInfo,
          notes: cs?.notes,
        });
      } catch (error) {
        console.log(error);
      }
    })
  );

  return {
    sent,
    created,
  };
};
