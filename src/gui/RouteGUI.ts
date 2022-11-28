import { Housing } from "../entities/Housing";
import { Location } from "../entities/Location";
import { Restaurant } from "../entities/Restaurant";
import { Route, RouteState } from "../entities/Route";
import { ResponseType } from "../helpers/Response";
import { IRouteService } from "../services/interfaces";

type SelectOption = { value: string };

export class RouteGUI {
  appDom: HTMLElement;
  dialogs: HTMLElement;
  possibleLocations: Location[] = [];
  possibleHousings: Housing[] = [];
  possibleRestaurants: Restaurant[] = [];
  routeForm?: HTMLFormElement;
  currentRoutesElement?: HTMLElement;
  currentRoutes: Route[] = [];
  userToken?: string;
  constructor(private appName: string, private routeService: IRouteService) {
    this.appDom = document.querySelector(this.appName) as HTMLElement;
    this.dialogs = document.querySelector("#dialogs") as HTMLElement;
  }

  render() {
    this.routeForm = this.createRouteForm();
    this.currentRoutesElement = this.createCurrentRoutes();
    if (this.appDom) {
      this.appDom.appendChild(this.routeForm);
      this.appDom.appendChild(this.currentRoutesElement);
    }
  }

  rerender() {
    this.currentRoutesElement?.remove();
    this.routeForm?.remove();
    this.loadCurrentRoutes();
    this.render();
  }

  setUserToken(token: string | undefined) {
    this.userToken = token;
  }

  createError(error: string) {
    const errorDiv = document.createElement("div") as HTMLDivElement;
    errorDiv.innerText = "Error: " + error;
    errorDiv.style.color = "red";
    setTimeout(() => {
      errorDiv.remove();
      if (!this.dialogs.children.length) {
        this.dialogs.style.display = "none";
      }
    }, 2000);
    this.dialogs.style.display = "block";
    this.dialogs.appendChild(errorDiv);
  }

  createSuccess(success: string) {
    const successDiv = document.createElement("div") as HTMLDivElement;
    successDiv.innerText = "Success: " + success;
    successDiv.style.color = "green";
    setTimeout(() => {
      successDiv.remove();
      if (!this.dialogs.children.length) {
        this.dialogs.style.display = "none";
      }
    }, 2000);
    this.dialogs.style.display = "block";
    this.dialogs.appendChild(successDiv);
  }

  createRoute(
    startLocationI: number,
    endLocationI: number,
    selectedStopsI: SelectOption[],
    selectedHousingsI: SelectOption[],
    selectedRestaurantsI: SelectOption[]
  ): boolean {
    if (!this.userToken) {
      this.createError("You need to be logged in to create a route");
      return false;
    }

    const newRoute = this.routeService.prepareRoute();

    const startLocation = this.possibleLocations.find(
      (location) => location.id === startLocationI
    ) as Location;
    const endLocation = this.possibleLocations.find(
      (location) => location.id === endLocationI
    ) as Location;

    const stops = selectedStopsI.map(
      (stop) =>
        this.possibleLocations.find(
          (location) => location.id === parseInt(stop.value)
        ) as Location
    );

    const selectedHousings = selectedHousingsI.map(
      (option) =>
        this.possibleHousings.find(
          (housing) => housing.id === parseInt(option.value)
        ) as Housing
    );

    const selectedRestaurants = selectedRestaurantsI.map(
      (option) =>
        this.possibleRestaurants.find(
          (restaurant) => restaurant.id === parseInt(option.value)
        ) as Restaurant
    );

    newRoute.setStart(startLocation);
    newRoute.setEnd(endLocation);
    for (const stop of stops) {
      newRoute.addStop(stop);
    }
    for (const housing of selectedHousings) {
      newRoute.addHousing(housing);
    }
    for (const restaurant of selectedRestaurants) {
      newRoute.addRestaurant(restaurant);
    }
    const resp = this.routeService.addRoute(this.userToken, newRoute);
    if (resp.type === ResponseType.Ok) {
      return true;
    }
    return false;
  }

  createRouteForm(): HTMLFormElement {
    const routeForm = document.createElement("form");
    routeForm.style.border = "1px solid black";
    routeForm.style.padding = "10px";

    const heading = document.createElement("h2");
    heading.innerText = "Create a new route";
    routeForm.appendChild(heading);

    const startLabel = document.createElement("label");
    startLabel.innerText = "Start location";
    startLabel.style.display = "block";
    routeForm.appendChild(startLabel);

    // add dropdowns of locations to pick start
    const startLocationEl = document.createElement("select");
    startLocationEl.name = "startLocation";
    startLocationEl.id = "start-location";
    this.possibleLocations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.id.toString();
      option.innerText = location.name;
      startLocationEl.appendChild(option);
    });
    routeForm.appendChild(startLocationEl);

    const endLabel = document.createElement("label");
    endLabel.innerText = "End location";
    endLabel.style.display = "block";
    routeForm.appendChild(endLabel);

    // add dropdowns of locations to pick end
    const endLocationEl = document.createElement("select");
    endLocationEl.name = "endLocation";
    endLocationEl.id = "end-location";
    this.possibleLocations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.id.toString();
      option.innerText = location.name;
      endLocationEl.appendChild(option);
    });
    routeForm.appendChild(endLocationEl);

    const stopsLabel = document.createElement("label");
    stopsLabel.innerText = "Stops";
    stopsLabel.style.display = "block";
    routeForm.appendChild(stopsLabel);

    // add dropdowns of locations to pick stops
    const stopsLocationEl = document.createElement("select");
    stopsLocationEl.name = "stopsLocation";
    stopsLocationEl.id = "stops-location";
    stopsLocationEl.multiple = true;
    this.possibleLocations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.id.toString();
      option.innerText = location.name;
      stopsLocationEl.appendChild(option);
    });
    routeForm.appendChild(stopsLocationEl);

    const housingLabel = document.createElement("label");
    housingLabel.innerText = "Housings";
    housingLabel.style.display = "block";
    routeForm.appendChild(housingLabel);

    // add dropdowns of locations to pick multiple housings
    const housingSelect = document.createElement("select");
    housingSelect.name = "housing";
    housingSelect.id = "housings";
    housingSelect.multiple = true;
    this.possibleHousings.forEach((housing) => {
      const option = document.createElement("option");
      option.value = housing.id.toString();
      option.innerText = housing.name;
      housingSelect.appendChild(option);
    });
    routeForm.appendChild(housingSelect);

    const restaurantLabel = document.createElement("label");
    restaurantLabel.innerText = "Restaurants";
    restaurantLabel.style.display = "block";
    routeForm.appendChild(restaurantLabel);

    // add dropdowns of locations to pick multiple restaurants
    const restaurantSelect = document.createElement("select");
    restaurantSelect.name = "restaurant";
    restaurantSelect.id = "restaurants";
    restaurantSelect.multiple = true;
    this.possibleRestaurants.forEach((restaurant) => {
      const option = document.createElement("option");
      option.value = restaurant.id.toString();
      option.innerText = restaurant.name;
      restaurantSelect.appendChild(option);
    });
    routeForm.appendChild(restaurantSelect);

    const submitButton = document.createElement("button");
    submitButton.innerText = "Create route";
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      const status = this.createRoute(
        parseInt(startLocationEl.value),
        parseInt(endLocationEl.value),
        Array.from(stopsLocationEl.selectedOptions),
        Array.from(housingSelect.selectedOptions),
        Array.from(restaurantSelect.selectedOptions)
      );
      if (status) {
        this.rerender();
        this.createSuccess("Route created successfully");
        return;
      }
    });

    routeForm.appendChild(submitButton);

    return routeForm;
  }

  renderRoute(parent: HTMLElement, route: Route) {
    const routeEl = document.createElement("div");
    routeEl.style.border = "1px solid black";
    routeEl.style.padding = "10px";
    routeEl.style.margin = "10px";

    const routeStatus = document.createElement("b");
    routeStatus.innerText = "Status: " + route.state;
    routeEl.appendChild(routeStatus);

    const startLocationEl = document.createElement("p");
    startLocationEl.innerText = `Start location: ${route.path.start!.name}`;
    routeEl.appendChild(startLocationEl);

    const endLocationEl = document.createElement("p");
    endLocationEl.innerText = `End location: ${route.path.end!.name}`;
    routeEl.appendChild(endLocationEl);

    const housingListEl = document.createElement("ul");
    housingListEl.innerText = "Housings:";
    routeEl.appendChild(housingListEl);
    for (const housing of route.housings) {
      const housingEl = document.createElement("li");
      housingEl.innerText = housing.getName();
      housingListEl.appendChild(housingEl);
    }

    const restaurantListEl = document.createElement("ul");
    restaurantListEl.innerText = "Restaurants:";
    routeEl.appendChild(restaurantListEl);
    for (const restaurant of route.restaurants) {
      const restaurantEl = document.createElement("li");
      restaurantEl.innerText = restaurant.getName();
      restaurantListEl.appendChild(restaurantEl);
    }

    const startButton = document.createElement("button");
    startButton.innerText = "Start route";
    startButton.addEventListener("click", () => {
      if (!this.userToken) {
        this.createError("You need to be logged in to create a route");
        return;
      }
      this.routeService.updateRouteStatus(
        this.userToken,
        route.id,
        RouteState.Active
      );
      this.rerender();
      this.createSuccess("Route started");
    });
    routeEl.appendChild(startButton);

    const pauseButton = document.createElement("button");
    pauseButton.innerText = "Pause route";
    pauseButton.addEventListener("click", () => {
      if (!this.userToken) {
        this.createError("You need to be logged in to create a route");
        return;
      }
      this.routeService.updateRouteStatus(
        this.userToken,
        route.id,
        RouteState.Paused
      );
      this.rerender();
      this.createSuccess("Route paused");
    });
    routeEl.appendChild(pauseButton);

    const finishButton = document.createElement("button");
    finishButton.innerText = "Finish route";
    finishButton.addEventListener("click", () => {
      if (!this.userToken) {
        this.createError("You need to be logged in to create a route");
        return;
      }
      this.routeService.updateRouteStatus(
        this.userToken,
        route.id,
        RouteState.Finished
      );
      this.rerender();
      this.createSuccess("Route finished");
    });
    routeEl.appendChild(finishButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel route";
    cancelButton.addEventListener("click", () => {
      if (!this.userToken) {
        this.createError("You need to be logged in to create a route");
        return;
      }
      this.routeService.updateRouteStatus(
        this.userToken,
        route.id,
        RouteState.Canceled
      );
      this.rerender();
      this.createSuccess("Route canceled");
    });
    routeEl.appendChild(cancelButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete route";
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (!this.userToken) {
        this.createError("You need to be logged in to delete a route");
        return;
      }
      this.routeService.deleteRoute(this.userToken, route.id);
      parent.removeChild(routeEl);
      this.createSuccess("Route deleted");
    });
    routeEl.appendChild(deleteButton);

    parent.appendChild(routeEl);
  }

  loadCurrentRoutes() {
    if (!this.userToken) {
      this.currentRoutes = [];
      return;
    }
    const resp = this.routeService.getRoutes(this.userToken);
    if (resp.type === ResponseType.Error) {
      this.createError(resp.error as string);
      return;
    }
    this.currentRoutes = resp.data as Route[];
  }
  createCurrentRoutes(): HTMLElement {
    const currentRoutesEl = document.createElement("div");
    currentRoutesEl.id = "current-routes";
    currentRoutesEl.style.border = "1px solid black";
    currentRoutesEl.style.padding = "10px";

    const currentRoutesTitle = document.createElement("h2");
    currentRoutesTitle.innerText = "Current routes";
    currentRoutesEl.appendChild(currentRoutesTitle);

    const currentRoutesWrapper = document.createElement("div");
    currentRoutesWrapper.style.border = "1px solid black";
    currentRoutesWrapper.style.padding = "10px";
    currentRoutesWrapper.style.margin = "10px";
    currentRoutesWrapper.style.display = "grid";
    currentRoutesWrapper.style.gridTemplateColumns = "1fr 1fr 1fr";

    currentRoutesWrapper.id = "current-routes-wrapper";
    currentRoutesEl.appendChild(currentRoutesWrapper);

    this.loadCurrentRoutes();

    for (const route of this.currentRoutes) {
      this.renderRoute(currentRoutesWrapper, route);
    }

    return currentRoutesEl;
  }

  addLocation(location: Location) {
    this.possibleLocations.push(location);
  }

  addHousing(housing: Housing) {
    this.possibleHousings.push(housing);
  }

  addRestaurant(restaurant: Restaurant) {
    this.possibleRestaurants.push(restaurant);
  }
}
