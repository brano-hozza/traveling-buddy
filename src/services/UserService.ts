import { User } from "../entities/User";
import { Response } from "../helpers/Response";
import { IUserService } from "./interfaces";

export class UserService implements IUserService {
  id_counter = 0;
  users: User[] = [];
  getNewId(): number {
    return this.id_counter++;
  }

  addUser(user: User): Response<User> {
    this.users.push(user);
    return Response.ok(user);
  }
  findUser(id: number): Response<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return Response.error("User not found");
    }
    return Response.ok(user);
  }
  findUserByName(name: string): Response<User> {
    const user = this.users.find((u) => u.name === name);
    if (!user) {
      return Response.error("User not found");
    }
    return Response.ok(user);
  }
  updatename(id: number, name: string): Response<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return Response.error("User not found");
    }
    user.name = name;
    return Response.ok(user);
  }
  deleteUser(id: number): Response<boolean> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return Response.error("User not found");
    }
    this.users = this.users.filter((u) => u.id !== id);
    return Response.ok(true);
  }
  setAdmin(id: number): Response<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return Response.error("User not found");
    }
    return Response.ok(user.setAdmin());
  }
  createGuest(): User {
    const user = User.CreateGuest(this.getNewId());
    this.users.push(user);
    return user;
  }
}
