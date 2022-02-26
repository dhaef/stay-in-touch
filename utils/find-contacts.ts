import {
  nextContacts,
  EstablishedContact,
  remove,
  create,
} from '../db/contacts';
import { getUser } from '../db/users';
import dayjs from 'dayjs';
import { sendEmail } from './send-email';

const getLineItem = (contact: EstablishedContact) => {
  let item = `${contact.name}`;

  if (contact?.contactInfo) {
    item += ` @${contact?.contactInfo}`;
  }

  if (contact?.notes) {
    item += `<p>Notes: ${contact?.notes}</p>`;
  }

  return `<div>${item}</div>`;
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
  const now = dayjs().unix();
  const then = dayjs().add(1, 'month').unix();
  //   get contacts for today
  const contacts: EstablishedContact[] = await nextContacts({ now, then });

  //   GROUP CONTACTS??
  const groupedContacts: { id: string; contacts: EstablishedContact[] }[] = [];
  console.log(groupedContacts);
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
  const thisHourContacts = [...contacts];

  const sent = await Promise.all(
    groupedContacts.map(async (gc) => {
      try {
        const user = await getUser(gc.id);

        const reminderTime = user?.reminderTime || 0;
        if (reminderTime !== hour) {
          const index = thisHourContacts.findIndex((thc) => thc.id === user.id);
          if (index > -1) {
            thisHourContacts.splice(index, 1);
          }
          return;
        }

        let msg = `
          <div>
              <h3>Hi!</h3>
              
              Here’s who you should keep in touch with:
              ${gc.contacts.map((cs) => getLineItem(cs))}

              <p>Hour: ${hour}</p>
              <p>Happy reconnecting!</p>
          </div>
        `;

        return await sendEmail(user.email, msg, `Stay In Touch!`);
      } catch (error) {
        console.log(error);
      }
    })
  );

  const created = await Promise.all(
    thisHourContacts.map(async (cs) => {
      try {
        await remove(cs.userId, cs.id);
        return await create({
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
