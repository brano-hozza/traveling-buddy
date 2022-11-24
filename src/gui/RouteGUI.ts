import { Housing } from "../entities/Housing";
import { Location } from "../entities/Location";
import { Restaurant } from "../entities/Restaurant";
import { Route } from "../entities/Route";
import { ResponseType } from "../helpers/Response";
import { IRouteService } from "../services/interfaces";

export class RouteGUI {
  appDom: HTMLElement;
  errors: HTMLElement;
  possibleLocations: Location[] = [];
  possibleHousings: Housing[] = [];
  possibleRestaurants: Restaurant[] = [];
  routeForm?: HTMLFormElement;
  currentRoutes?: HTMLElement;
  userToken?: string;
  constructor(private appName: string, private routeService: IRouteService) {
    this.appDom = document.querySelector(this.appName) as HTMLElement;
    this.errors = document.querySelector("#errors") as HTMLElement;
  }

  render() {
    this.routeForm = this.createRouteForm();
    this.currentRoutes = this.createCurrentRoutes();
    if (this.appDom) {
      this.appDom.appendChild(this.routeForm);
      this.appDom.appendChild(this.currentRoutes);
    }
  }

  setUserToken(token: string | undefined) {
    this.userToken = token;
  }

  createError(error: string) {
    this.errors.style.display = "block";
    this.errors.innerText = error;
    setTimeout(() => {
      this.errors.innerText = "";
      this.errors.style.display = "none";
    }, 2000);
    this.appDom.prepend;
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
      if (!this.userToken) {
        this.createError("You need to be logged in to create a route");
        return;
      }

      const newRoute = this.routeService.prepareRoute();

      const startLocation = this.possibleLocations.find(
        (location) => location.id === parseInt(startLocationEl.value)
      ) as Location;
      const endLocation = this.possibleLocations.find(
        (location) => location.id === parseInt(endLocationEl.value)
      ) as Location;
      const selectedHousings = Array.from(housingSelect.selectedOptions).map(
        (option) =>
          this.possibleHousings.find(
            (housing) => housing.id === parseInt(option.value)
          ) as Housing
      );
      const selectedRestaurants = Array.from(
        restaurantSelect.selectedOptions
      ).map(
        (option) =>
          this.possibleRestaurants.find(
            (restaurant) => restaurant.id === parseInt(option.value)
          ) as Restaurant
      );

      newRoute.setStart(startLocation);
      newRoute.setEnd(endLocation);
      for (const housing of selectedHousings) {
        newRoute.addHousing(housing);
      }
      for (const restaurant of selectedRestaurants) {
        newRoute.addRestaurant(restaurant);
      }
      this.routeService.addRoute(this.userToken, newRoute);
    });

    routeForm.appendChild(submitButton);

    return routeForm;
  }

  renderRoute(parent: HTMLElement, route: Route) {
    const routeEl = document.createElement("div");
    routeEl.style.border = "1px solid black";
    routeEl.style.padding = "10px";
    routeEl.style.margin = "10px";

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

    parent.appendChild(routeEl);
  }

  showCurrentRoutes() {
    const wrapper = document.querySelector(
      "#current-routes-wrapper"
    ) as HTMLElement;
    wrapper.innerHTML = "";
    if (!this.userToken) {
      this.createError("You need to be logged in to see your routes");
      return;
    }
    const resp = this.routeService.getRoutes(this.userToken);
    if (resp.type === ResponseType.Error) {
      this.createError(resp.error as string);
      return;
    }
    const currentRoutes = resp.data as Route[];
    for (const route of currentRoutes) {
      this.renderRoute(wrapper, route);
    }
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
    currentRoutesWrapper.id = "current-routes-wrapper";
    currentRoutesEl.appendChild(currentRoutesWrapper);

    const showButton = document.createElement("button");
    showButton.innerText = "Show current routes";
    showButton.addEventListener("click", this.showCurrentRoutes.bind(this));
    currentRoutesEl.appendChild(showButton);

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
