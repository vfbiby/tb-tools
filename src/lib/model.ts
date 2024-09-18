/**
 * Abstract entity model with `gid` property initialization
 * and `equals` method for entity comparisons.
 */
export abstract class AbstractEntity {

  constructor(public gid?: string) {
    gid ? (this.gid = gid) : (this.gid = crypto.randomUUID());
  }

  equals(e1: AbstractEntity, e2: AbstractEntity) {
    return e1.gid == e2.gid
  }
}

/*
 * The class helps with code completion
 *
 * Defines the interface of objects in the phone number table.
 */
export class EmailAddress extends AbstractEntity {
  constructor(
    public contactId: string,
    public type: string,
    public email: string,
    gid?: string
  ) {
    super(gid);
  }
}

/*
 * The class helps with code completion
 *
 * Defines the interface of objects in the phone number table.
 */
export class PhoneNumber extends AbstractEntity {
  constructor(
    public contactId: string,
    public type: string,
    public phone: string,
    gid?: string
  ) {
    super(gid)
  }
}

/*
 * Class mapped to the the contacts table in db.ts by the line:
 * db.contacts.mapToClass(Contact)
 */
export class Contact extends AbstractEntity {
  emails: EmailAddress[]
  phones: PhoneNumber[]

  constructor(
    public firstName: string,
    public lastName: string,
    gid?: string
  ) {
    super(gid)
    // Define navigation properties.
    // Making them non-enumerable will prevent them from being handled by indexedDB
    // when doing put() or add().
    Object.defineProperties(this, {
      emails: {value: [], enumerable: false, writable: true},
      phones: {value: [], enumerable: false, writable: true}
    });
  }
}
