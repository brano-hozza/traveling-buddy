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
    const userId = resp.data?.id as number;
    if (!this.routes[userId]) {
      return Response.error("User doesnt have routes");
    }
    const route = this.routes[userId].find((r) => r.id === routeId);
    if (!route) {
      return Response.error("Route doesnt exist");
    }
    this.routes[userId] = this.routes[userId].filter((r) => r.id !== routeId);

    return Response.ok();
  }

  getRoutes(
    token: string,
    endLocationFilter?: number,
    startLocationFilter?: number
  ): Response<Route[]> {
    const resp = this.authService.getUser(token);
    if (resp.type === ResponseType.Error) {
      return Response.error(resp.error as string);
    }
    let routes = this.routes[resp.data!.id] ?? [];
    if (endLocationFilter !== undefined) {
      routes = routes.filter((r) => r.path.end!.id === endLocationFilter);
    }
    if (startLocationFilter !== undefined) {
      routes = routes.filter((r) => r.path.start!.id === startLocationFilter);
    }
    return Response.ok(routes);
  }
}
