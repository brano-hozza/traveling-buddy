import { IAuthService, IRouteService } from "./interfaces";

export class RouteService implements IRouteService {
  constructor(private authService: IAuthService) {}
}
