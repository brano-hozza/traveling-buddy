import { Housing } from "./entities/Housing";
import { Location } from "./entities/Location";
import { Restaurant } from "./entities/Restaurant";
import { AuthGUI } from "./gui/AuthGUI";
import { RouteGUI } from "./gui/RouteGUI";
import { AuthService } from "./services/AuthService";
import { RouteService } from "./services/RouteService";
import { UserService } from "./services/UserService";

// Prepare services
const userService = new UserService();
const authService = new AuthService(userService);
const routeService = new RouteService(authService);

// Init GUI
const dialogs = document.createElement("div");
dialogs.id = "dialogs";
dialogs.style.border = "2px dashed black";
dialogs.style.padding = "10px";
dialogs.style.display = "none";

const app = document.querySelector("#app");
if (!app) {
  throw new Error("No app element found");
}
app?.appendChild(dialogs);

const authGUI = new AuthGUI("#app", authService);
const routeGUI = new RouteGUI("#app", routeService);

authGUI.setTokenCallback(routeGUI.setUserToken.bind(routeGUI));
authGUI.setRerenderCallback(routeGUI.rerender.bind(routeGUI));

// Mock data
for (let i = 0; i < 10; i++) {
  routeGUI.addLocationOption(new Location(i, "Location " + i, "Address " + i));

  routeGUI.addHousingOption(
    new Housing(i, "Housing " + i, "Funny address", [`Offer - ${i}`])
  );
  routeGUI.addRestaurantOption(
    new Restaurant(i, "Restaurant " + i, "Hungry address", [`Menu item - ${i}`])
  );
}

// Render GUI
authGUI.render();
routeGUI.render();
