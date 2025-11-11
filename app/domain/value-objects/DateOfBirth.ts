export class DateOfBirth {
  private constructor(private readonly value: Date) {
    const today = new Date();
    if (this.value > today) {
      throw new Error("Birthday cannot be in the future");
    }
  }

  static create(dateString: string): DateOfBirth {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return new DateOfBirth(date);
  }

  getValue(): Date {
    return this.value;
  }

  toISOString(): string {
    return this.value.toISOString().split("T")[0];
  }

  calculateAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.value.getFullYear();
    const monthDifference = today.getMonth() - this.value.getMonth();
    const dayDifference = today.getDate() - this.value.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }
}

