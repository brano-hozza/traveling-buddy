import { Route, RouteBuilder, RouteState } from "../entities/Route";
import { User } from "../entities/User";
import { Response } from "../helpers/Response";

export interface IAuthService {
  /**
   * Method to login
   * @returns user token
   */
  login(name: string, password: string): Response<string>;
  /**
   * Method to register new user
   * @returns user token
   */
  register(name: string, email: string, password: string): Response<string>;
  /**
   * Method to check token validity
   * @returns boolean
   */
  verifyToken(token: string): Response<boolean>;
  logout(token: string): Response<void>;
  /**
   * Method to create guest user
   * @returns user token
   */
  createGuest(): string;
  /**
   * Method to get user from token
   * @returns user or error on invalid token
   */
  getUser(token: string): Response<User>;
}

export interface IUserService {
  addUser(user: User): Response<User>;
  /**
   * Method to find user by his ID
   * @returns user
   */
  findUser(id: number): Response<User>;
  /**
   * Method to find user by his username
   * @returns user
   */
  findUserByName(name: string): Response<User>;
  updatename(id: number, name: string): Response<User>;
  deleteUser(id: number): Response<boolean>;
  setAdmin(id: number): Response<User>;
  /**
   * Method to get ID for new user
   * @returns number
   */
  getNewId(): number;
  /**
   * Method to create guest user
   * @returns user
   */
  createGuest(): User;
}

export interface IRouteService {
  /**
   * Method to create route builder for creating routes
   * @returns RouteBuilder
   */
  createRouteBuilder(): RouteBuilder;
  /**
   * Method to add new route to system
   * @returns Response
   */
  addRoute(token: string, route: Route): Response<void>;
  /**
   * Method to get routes, you can also apply start and end filter
   * @returns Route[]
   */
  getRoutes(
    token: string,
    endLocationFilter?: number,
    startLocationFilter?: number
  ): Response<Route[]>;
  deleteRoute(token: string, routeId: number): Response<void>;

  /**
   * Method to update route status
   * @returns Response
   */
  updateRouteStatus(
    token: string,
    routeId: number,
    status: RouteState
  ): Response<void>;
}
