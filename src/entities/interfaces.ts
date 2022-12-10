export interface IRestaurant {
  getName(): string;
  getAddress(): string;
  getMenu(): string[];
}

export enum HousingState {
  Created,
  Used,
  Empty,
  Full,
  Canceled,
}
export interface IHousing {
  getName(): string;
  getAddress(): string;
  getOffers(): string[];
  /**
   * Adds user to housing if there's a space
   * @param id id of user
   * @return {boolean} status of adding T -> success, F-> error
   */
  addUser(id: number): boolean;

  /**
   * Removes user from housing
   * @param id id of user
   * @return {boolean} status of removing T -> success, F-> error
   */
  removeUser(id: number): boolean;
  getHousingState(): HousingState;
  cancelHousing(): void;
}
