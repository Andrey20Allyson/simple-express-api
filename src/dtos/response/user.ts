import { User } from "@prisma/client";

export class UserResponseDTO {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly age: number,
    readonly birthDate: Date,
  ) { }

  static calculateAge(birth: Date, now: Date = new Date()): number {
    const yearDiff = now.getFullYear() - birth.getFullYear();
    
    if (now.getMonth() > birth.getMonth()) {
      return yearDiff;
    }

    if (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate()) {
      return yearDiff;
    }

    return yearDiff - 1;
  }

  static from(model: User) {
    return new this(
      model.id,
      model.name,
      this.calculateAge(model.birthDate),
      model.birthDate,
    )
  }
}