import {Contact, EmailAddress, PhoneNumber} from './model'
import {newDb as oDb} from "~src/lib/newDb";

/**
 * Delete the entire database
 */
export async function deleteDatabase(db: typeof oDb) {
  await db.delete()
}

/**
 * Open a  database
 */
export async function openDatabase(db: typeof oDb) {
  await db.open()
}

/**
 * Clear all tables
 */
export async function clearAllTables(db: typeof oDb) {
  await Promise.all(
    [db.contacts.clear(),
      db.emails.clear(),
      db.phones.clear()]);
}

/**
 * Read all contacts
 */
export async function readAllContacts(db: typeof oDb) {
  return await db.contacts.toArray()
}

/**
 * Delete all contacts
 */
export async function deleteAllContact(db: typeof oDb) {
  return await db.contacts.clear()
}

/**
 * Create a contact
 *
 * Note that since the contact is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export async function createContact(db: typeof oDb, contact: Contact): Promise<string> {
  return await db.contacts.put(contact)
}

/**
 * Read a contact
 */
export async function readContact(db: typeof oDb, contactGID: string): Promise<Contact> {
  return await db.contacts.get(contactGID)
}

/**
 * Update contact
 */
export async function updateContact(db: typeof oDb, contact: Contact) {
  return await db.contacts.put(contact)
}

/**
 * Delete contact
 */
export async function deleteContact(db: typeof oDb, contact: Contact) {
  return await db.contacts.where('gid').equals(contact.gid).delete()
}

/**
 * Read all email addresses
 */
export async function readAllEmailAddresses(db: typeof oDb) {
  return await db.emails.toArray()
}

/**
 * Delete all email addresses
 */
export async function deleteAllEmailAddresses(db: typeof oDb) {
  return await db.emails.clear()
}

/**
 * Create email address record
 *
 * Note that since the EmailAddress instance
 * is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export async function createEmailAddress(db: typeof oDb, email: EmailAddress) {
  return await db.emails.put(email)
}

/**
 * Update an email address record
 */
export async function updateEmailAddress(db: typeof oDb, email: EmailAddress) {
  return await db.emails.put(email)
}

/**
 * Delete contact
 */
export async function deleteEmail(db: typeof oDb, email: EmailAddress) {
  await db.contacts.where('gid').equals(email.gid).delete()
}

/**
 * Read all phone number records
 */
export async function readAllPhoneNumbers(db: typeof oDb) {
  return await db.phones.toArray()
}

/**
 * Delete all phone numbers
 */
export async function deleteAllPhoneNumbers(db: typeof oDb) {
  await db.phones.clear()
}

/**
 * Create email address record
 */
export async function createPhoneNumber(db: typeof oDb, phone: PhoneNumber) {
  return await db.phones.put(phone)
}

/**
 * Update the PhoneNumber record
 */
export async function updatePhoneNumber(db: typeof oDb, phone: PhoneNumber) {
  await db.phones.put(phone)
}

/**
 * Deletre the phone number
 */
export async function deletePhoneNumber(db: typeof oDb, phone: PhoneNumber) {
  await db.phones.where('gid').equals(phone.gid).delete()
}

/**
 * Load email records and
 * update the corresponding ocntact fields.
 */
export async function loadContactEmails(contact, db) {
  contact.emails =
    await db.emails.where('contactId').equals(contact.id).toArray()
}

/**
 * Load phone records and
 * update the ocrresponding ocntact fields.
 */
export async function loadContactPhones(contact: Contact, db) {
  contact.phones =
    await db.phones.where('contactId').equals(contact.gid).toArray()
}

/**
 * Load navgiation properties (Email and Phone records) and
 * update the ocrresponding ocntact fields.
 */
export async function loadNavigationProperties(db: typeof oDb, contact: Contact) {
  [contact.emails, contact.phones] = await Promise.all([
    db.emails.where('contactId').equals(contact.gid).toArray(),
    db.phones.where('contactId').equals(contact.gid).toArray()
  ]);
}

/**
 * Save a contact entity.  If email or phone records
 * were removed from the contact, then these will also
 * be deleted from the database.
 */
export async function saveContact(db: typeof oDb, contact: Contact) {
  return db.transaction('rw', db.contacts, db.emails, db.phones, async () => {

    // Add or update contact. If add, record contact.id.
    contact.gid = await db.contacts.put(contact);
    // Save all navigation properties (arrays of emails and phones)
    // Some may be new and some may be updates of existing objects.
    // put() will handle both cases.
    // (record the result keys from the put() operations into emailIds and phoneIds
    //  so that we can find local deletes)
    let [emailIds, phoneIds] = await Promise.all([
      Promise.all(contact.emails.map(email => updateEmailAddress(db, email))),
      Promise.all(contact.phones.map(phone => updatePhoneNumber(db, phone)))
    ]);

    // Was any email or phone number deleted from out navigation properties?
    // Delete any item in DB that reference us, but is not present
    // in our navigation properties:
    await Promise.all([
      db.emails.where('contactId').equals(contact.gid) // references us
        .and(email => emailIds.indexOf(email.id) === -1) // Not anymore in our array
        .delete(),

      db.phones.where('contactId').equals(contact.gid)
        .and(phone => phoneIds.indexOf(phone.id) === -1)
        .delete()
    ])
  });
}