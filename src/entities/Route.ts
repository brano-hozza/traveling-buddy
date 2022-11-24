import { IHousing, IRestaurant } from "./interfaces";
import { Location } from "./Location";

export enum RouteState {
  Created = "Created",
  Active = "Active",
  Paused = "Paused",
  Canceled = "Canceled",
  Finished = "Finished",
}
export class Path {
  public start?: Location;
  public end?: Location;
  public stops: Location[] = [];

  public setStart(location: Location) {
    this.start = location;
  }

  public setEnd(location: Location) {
    this.end = location;
  }

  public addStop(location: Location) {
    this.stops.push(location);
  }
}
export class Route {
  public id: number;
  public name: string;
  public state: RouteState;
  public path: Path;
  public date: Date;
  public housings: IHousing[];
  public restaurants: IRestaurant[];
  constructor(id: number) {
    this.id = id;
    this.name = "";
    this.state = RouteState.Created;
    this.path = new Path();
    this.date = new Date();
    this.housings = [];
    this.restaurants = [];
  }

  public addHousing(housing: IHousing) {
    this.housings.push(housing);
  }

  public addRestaurant(restaurant: IRestaurant) {
    this.restaurants.push(restaurant);
  }

  public removeHousing(housing: IHousing) {
    this.housings = this.housings.filter((h) => h !== housing);
  }

  public removeRestaurant(restaurant: IRestaurant) {
    this.restaurants = this.restaurants.filter((r) => r !== restaurant);
  }

  public start() {
    this.state = RouteState.Active;
  }

  public pause() {
    this.state = RouteState.Paused;
  }

  public cancel() {
    this.state = RouteState.Canceled;
  }

  public finish() {
    this.state = RouteState.Finished;
  }

  public setStart(location: Location) {
    this.path.setStart(location);
  }

  public setEnd(location: Location) {
    this.path.setEnd(location);
  }

  public addStop(location: Location) {
    this.path.addStop(location);
  }
}
