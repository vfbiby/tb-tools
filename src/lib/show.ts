// Import stylesheets
import './style.css';
import Dexie from 'dexie';
import {Console} from './console';
import {newDb as db} from './newDb';
import {Contact, EmailAddress, PhoneNumber} from './model';
import {
  loadNavigationProperties,
  loadContactEmails,
  loadContactPhones,
  saveContact,
  createContact,
  createEmailAddress,
  createPhoneNumber,
  clearAllTables,
  deleteDatabase,
  openDatabase,
  readContact
} from './modelUtils';

const c: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById('console')

const console = new Console(c)

// Test it:
console.log("Hello Dexie Lovers!")
console.log("==================\n")

async function clearDB() {
  // Initialize our Console widget - it will log browser window.
  try {
    console.log("Clearing database with clearAllTables...")
    await clearAllTables(db)
    console.logN()
    console.log("We can also use deleteDatabase(db) and openDatabase(db) also")
    console.log('\n')
    //await deleteDatabase(db)
    //await openDatabase(db)

    console.log("Seeding database with some contacts...");
    console.logN()
  } catch (ex) {
    console.error(ex);
  }
}

let ARNOLD_GLOBAL_ID: string
let ADAM_GLOBAL_ID: string

const f = async () => {
  await clearDB();
  await addArnold();
  await addArnoldContactData()
  await addAdam()
  await addAdamContactData()
  console.logN()
  console.logNL()
  await cascadingSaveOnAdam()
  console.logN()
  console.logNL()
  await printContacts()
  console.logN()
  console.logNL()
  await loadAdamWithNavigationProperties()
}
f()

async function addArnold() {
  await db.transaction('rw', db.contacts, async () => {
    // Populate a contact
    const arnold = new Contact('Arnold', 'Fitzgerald')

    ARNOLD_GLOBAL_ID = await createContact(db, arnold)
    https://youtu.be/aLg4AV60uWY
      console.log(`Dexie arnold assigned id is ${ARNOLD_GLOBAL_ID}`)

    console.logN()

    const c: Contact = await readContact(db, arnold.gid)

    console.log(`DB Dexie Arnold first name is ${c.firstName} and the gid is ${c.gid}`)
  })
}

async function addArnoldContactData() {
  await db.transaction('rw', db.contacts, db.phones, db.emails, async () => {

    console.logN()

    console.log(`Adding contact data for Arnold`)

    console.logN()

    let arnold: Contact = await readContact(db, ARNOLD_GLOBAL_ID)
    console.log(
      `DB Dexie Arnold first name is ${arnold.firstName} and the gid is ${arnold.gid}`)

    await createEmailAddress(
      db, new EmailAddress(arnold.gid, 'home', 'arnold@email.com'))

    await createEmailAddress(
      db, new EmailAddress(arnold.gid, 'work', 'arnold@abc.com'))

    await createPhoneNumber(db, new PhoneNumber(arnold.gid, 'home', '12345678'))

    await createPhoneNumber(db, new PhoneNumber(arnold.gid, 'work', '987654321'))

    await loadNavigationProperties(db, arnold)

    console.log(`Arnold with navigation properties`)
    console.logJSON(arnold)
  })
}

async function addAdam() {
  await db.transaction('rw', db.contacts, async () => {
    // Populate a contact
    const adam = new Contact('Adam', 'Tensta')

    ADAM_GLOBAL_ID = await createContact(db, adam)
    console.logN()
    console.logN()

    console.log(`Dexie adam assigned id is ${ADAM_GLOBAL_ID}`)

    console.logN()

    const c: Contact = await readContact(db, adam.gid)

    console.log(`DB Dexie Adam first name is ${c.firstName} and the gid is ${c.gid}`)
  })
}

async function addAdamContactData() {
  await db.transaction('rw', db.contacts, db.phones, db.emails, async () => {

    console.logN()

    console.log(`Adding contact data for Adam`)

    console.logN()

    let adam: Contact = await readContact(db, ADAM_GLOBAL_ID)
    console.log(
      `DB Dexie Adam first name is ${adam.firstName} and the gid is ${adam.gid}`)

    await createEmailAddress(db, new EmailAddress(adam.gid, 'home', 'adam@tensta.se'))
    await createPhoneNumber(db, new PhoneNumber(adam.gid, 'work', 'adam@88888888.se'))
    await loadNavigationProperties(db, adam)

    console.log(`Adam with navigation properties`)
    console.logJSON(adam)
  })
}

async function cascadingSaveOnAdam() {

  console.log("Adding another phone entry for Adam Tensta...")

  let adam = await db.contacts.orderBy('lastName').last()
  await loadNavigationProperties(db, adam)
  console.log(`Found contact ${adam.firstName} and this is the JSON Before the Cascading Save`)

  console.logNL()
  console.logJSON(adam)

  await db.phones.add(new PhoneNumber(adam.gid, 'custom', '+46 7777777'))

  adam.phones.push(new PhoneNumber(adam.gid, 'custom', '112'))

  console.log("Cascading save on Adam")
  await saveContact(db, adam)
  adam = await db.contacts.orderBy('lastName').last()

  console.logNL()

  console.log(`Found contact ${adam.firstName} and this is the JSON after the Cascading Save`)

  console.logNL()
  console.logJSON(adam)
}

async function printContacts() {

  // Now we're gonna list all contacts starting with letter 'A','B' or 'C'
  // and print them out.
  // For each contact, also resolve the navigation properties.

  // For atomicity and speed, use a single transaction for the
  // queries to make:
  let contacts = await db.transaction('r', [db.contacts, db.phones, db.emails], async () => {

    // Query some contacts
    let contacts = await db.contacts
      .where('firstName').startsWithAnyOfIgnoreCase('a', 'b', 'c')
      .sortBy('id');

    // Resolve array properties 'emails' and 'phones'
    // on each and every contact:
    await Promise.all(contacts.map(contact => loadNavigationProperties(db, contact)));

    return contacts;
  });

  // Print result
  console.logNL()
  console.log("Database contains the following contacts:");
  contacts.forEach(contact => {
    console.log(contact.gid + ". " + contact.firstName + " " + contact.lastName);
    console.log("   Phone numbers: ");
    contact.phones.forEach(phone => {
      console.log("     " + phone.phone + "(" + phone.type + ")");
    });
    console.log("   Emails: ");
    contact.emails.forEach(email => {
      console.log("     " + email.email + "(" + email.type + ")");
    });
  });
}


async function loadAdamWithNavigationProperties() {

  console.logNL()
  console.logNL()

  let adam: Contact = await readContact(db, ADAM_GLOBAL_ID)
  console.log(JSON.stringify(adam));
}