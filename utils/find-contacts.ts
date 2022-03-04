import {
  nextContacts,
  EstablishedContact,
  remove,
  create,
} from '../db/contacts';
import { getUser } from '../db/users';
import dayjs from 'dayjs';
import { sendEmail } from './send-email';

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
  const now = dayjs().unix();
  const then = dayjs().add(1, 'day').unix();
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
