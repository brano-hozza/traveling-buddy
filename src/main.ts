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
const errors = document.createElement("div");
errors.id = "errors";
errors.style.color = "red";
errors.style.border = "1px solid red";
errors.style.padding = "10px";
errors.style.display = "none";

document.body.appendChild(errors);
const authGUI = new AuthGUI("#app", authService);
const routeGUI = new RouteGUI("#app", routeService);
authGUI.setTokenCallback(routeGUI.setUserToken.bind(routeGUI));

// Mock data
for (let i = 0; i < 10; i++) {
  routeGUI.addLocation(new Location(i, "Location" + i, "Address" + i));

  routeGUI.addHousing(
    new Housing(i, "Housing " + i, "Funny address", [`Offer - ${i}`])
  );
  routeGUI.addRestaurant(
    new Restaurant(i, "Restaurant " + i, "Hungry address", [`Menu item - ${i}`])
  );
}

// Render GUI
authGUI.render();
routeGUI.render();
