export class PhoneNumber {
  private static readonly PHONE_REGEX = /^\d{10}$/;

  private constructor(private readonly value: string) {
    if (!PhoneNumber.PHONE_REGEX.test(value)) {
      throw new Error("Phone number must be exactly 10 digits");
    }
  }

  static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}

