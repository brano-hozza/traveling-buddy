import { HousingState, IHousing } from "./interfaces";

export class Housing implements IHousing {
  public id: number;
  public state: HousingState = HousingState.Created;
  public name: string;
  public address: string;
  public offers: string[];
  public users: number[] = [];
  public maxUsers: number;

  constructor(id: number, name: string, address: string, offers: string[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.offers = offers;
    this.maxUsers = 20;
  }
  addUser(id: number): boolean {
    if (this.state === HousingState.Full) {
      return false;
    }
    this.users.push(id);
    if (this.users.length == this.maxUsers) {
      this.state = HousingState.Full;
    }
    return true;
  }
  removeUser(id: number): boolean {
    const old_count = this.users.length;
    this.users = this.users.filter((_id) => _id !== id);
    if (old_count === this.users.length) {
      return false;
    }
    return true;
  }
  getHousingState(): HousingState {
    return this.state;
  }

  cancelHousing(): void {
    this.state = HousingState.Canceled;
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
