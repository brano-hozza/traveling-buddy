export enum UserType {
  Admin = "Admin",
  User = "User",
  Guest = "Guest",
}
export class User {
  public id: number;
  public name?: string;
  public email?: string;
  public password?: string;
  public type: UserType;
  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = UserType.User;
  }

  public setAdmin() {
    this.type = UserType.Admin;
    return this;
  }

  public setGuest() {
    this.type = UserType.Guest;
    return this;
  }

  public static CreateGuest(id: number): User {
    return new User(id, "Guest", "", "").setGuest();
  }
}
