import { IHousing } from "./interfaces";

export class Housing implements IHousing {
  public id: number;
  public name: string;
  public address: string;
  public offers: string[];

  constructor(id: number, name: string, address: string, offers: string[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.offers = offers;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  getOffers(): string[] {
    return this.offers;
  }
}
