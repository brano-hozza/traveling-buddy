import { AuthGUI } from "./gui/AuthGUI";
import { AuthService } from "./services/AuthService";
import { RouteService } from "./services/RouteService";
import { UserService } from "./services/UserService";
// Prepare services
const userService = new UserService();
const authService = new AuthService(userService);
const routeService = new RouteService(authService);

// Create GUI
const authGUI = new AuthGUI("#app", authService);
