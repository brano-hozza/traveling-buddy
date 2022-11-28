import { User } from "../entities/User";
import { Response, ResponseType } from "../helpers/Response";
import { IAuthService, IUserService } from "./interfaces";

export class AuthService implements IAuthService {
  logged_tokens: Record<string, number> = {};
  userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }
  /**
   * Generate a random token
   * @returns a random string of 32 characters
   */
  generateToken(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  login(name: string, password: string): Response<string> {
    const resp = this.userService.findUserByName(name);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    const user = resp.data as User;
    if (user.password !== password) {
      return Response.error("Invalid password");
    }
    const token = this.generateToken();
    this.logged_tokens[token] = user.id;
    return Response.ok(token);
  }

  register(name: string, email: string, password: string): Response<string> {
    if (password.length < 5) {
      return Response.error("Password must be at least 5 characters long");
    }
    if (name.length < 3) {
      return Response.error("Name must be at least 3 characters long");
    }
    if (!email.includes("@")) {
      return Response.error("Invalid email");
    }

    const user = new User(this.userService.getNewId(), name, email, password);
    const resp = this.userService.addUser(user);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    let token;
    // check if token is already in use
    do {
      token = this.generateToken();
    } while (this.logged_tokens[token]);

    // set new token
    this.logged_tokens[token] = user.id;

    return Response.ok(token);
  }

  verifyToken(token: string): Response<boolean> {
    if (this.logged_tokens[token]) {
      return Response.ok(true);
    }
    return Response.error("Invalid token");
  }
  logout(token: string): Response<void> {
    if (this.logged_tokens[token] !== undefined) {
      delete this.logged_tokens[token];
      return Response.ok();
    }
    return Response.error("Invalid token");
  }
  createGuest(): string {
    const token = this.generateToken();
    const user = this.userService.createGuest();
    this.logged_tokens[token] = user.id;
    return token;
  }
  getUser(token: string): Response<User> {
    if (this.logged_tokens[token] !== undefined) {
      const id = this.logged_tokens[token];
      return this.userService.findUser(id);
    }
    return Response.error("Invalid token");
  }
}
