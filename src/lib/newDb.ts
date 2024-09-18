import Dexie from 'dexie';

import {
  EmailAddress,
  PhoneNumber,
  Contact
} from './model';

export class AppDatabase extends Dexie {

  public contacts: Dexie.Table<Contact, string>
  public emails: Dexie.Table<EmailAddress, number>
  public phones: Dexie.Table<PhoneNumber, number>

  constructor() {

    super("ContactsDatabase")
    const db = this

    //
    // Define tables and indexes
    //
    db.version(1).stores({
      contacts: '&gid, firstName, lastName',
      emails: '&gid, contactId, type, email',
      phones: '&gid, contactId, type, phone',
    });

    // Let's physically map Contact class to contacts table.
    // This will make it possible to call loadEmailsAndPhones()
    // directly on retrieved database objects.
    db.contacts.mapToClass(Contact)
    db.emails.mapToClass(EmailAddress)
    db.phones.mapToClass(PhoneNumber)
  }
}

export const newDb = new AppDatabase()