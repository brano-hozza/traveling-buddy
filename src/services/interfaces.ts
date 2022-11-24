import { User } from "../entities/User";
import { Response } from "../helpers/Response";

export interface IAuthService {
  login(name: string, password: string): Response<string>;
  register(name: string, email: string, password: string): Response<string>;
  verifyToken(token: string): Response<boolean>;
  logout(token: string): Response<void>;
  createGuest(): string;
  getUser(token: string): Response<User>;
}

export interface IUserService {
  addUser(user: User): Response<User>;
  findUser(id: number): Response<User>;
  findUserByName(name: string): Response<User>;
  updatename(id: number, name: string): Response<User>;
  deleteUser(id: number): Response<boolean>;
  setAdmin(id: number): Response<User>;
  getNewId(): number;
  createGuest(): User;
}

export interface IRouteService {}
