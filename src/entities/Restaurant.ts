import { IRestaurant } from "./interfaces";

export class Restaurant implements IRestaurant {
  public id: number;
  public name: string;
  public address: string;
  public menu: string[];

  constructor(id: number, name: string, address: string, menu: string[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.menu = menu;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  getMenu(): string[] {
    return this.menu;
  }
}
