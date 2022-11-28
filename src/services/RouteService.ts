import { Route, RouteState } from "../entities/Route";
import { Response, ResponseType } from "../helpers/Response";
import { IAuthService, IRouteService } from "./interfaces";

export class RouteService implements IRouteService {
  id_counter = 0;
  routes: Record<number, Route[]> = {};
  constructor(private authService: IAuthService) {}

  prepareRoute() {
    return new Route(this.id_counter++);
  }

  addRoute(token: string, route: Route): Response<void> {
    const resp = this.authService.getUser(token);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    if (!this.routes[resp.data?.id as number]) {
      this.routes[resp.data?.id as number] = [];
    }
    this.routes[resp.data?.id as number].push(route);

    return Response.ok();
  }

  updateRouteStatus(
    token: string,
    routeId: number,
    status: RouteState
  ): Response<void> {
    const resp = this.authService.getUser(token);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    const userRoutes = this.routes[resp.data?.id as number];
    if (!userRoutes) {
      return Response.error("No routes found");
    }
    const route = userRoutes.find((r) => r.id === routeId);
    if (!route) {
      return Response.error("Route not found");
    }
    route.setStatus(status);
    return Response.ok();
  }

  deleteRoute(token: string, routeId: number): Response<void> {
    const resp = this.authService.getUser(token);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    if (!this.routes[resp.data?.id as number]) {
      return Response.error("User doesnt have routes");
    }
    if (this.routes[resp.data?.id as number][routeId] === undefined) {
      return Response.error("Route doesnt exist");
    }
    this.routes[resp.data?.id as number] = this.routes[
      resp.data?.id as number
    ].filter((r) => r.id !== routeId);

    return Response.ok();
  }

  getRoutes(token: string): Response<Route[]> {
    const resp = this.authService.getUser(token);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    const routes = Object.entries(this.routes).reduce((acc, val) => {
      if (resp.data?.id === Number(val[0])) {
        acc.push(...val[1]);
      }
      return acc;
    }, [] as Route[]);
    return Response.ok(routes);
  }
}
