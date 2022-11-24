import { User } from "../entities/User";
import { ResponseType } from "../helpers/Response";
import { IAuthService } from "../services/interfaces";

export class AuthGUI {
  currentToken?: string;
  appDom: HTMLElement;
  errors: HTMLDivElement;
  registerForm?: HTMLFormElement;
  loginForm?: HTMLFormElement;
  logoutForm?: HTMLFormElement;
  userInfo?: HTMLDivElement;
  tokenCallback?: (token: string | undefined) => void;
  constructor(private appName: string, private authService: IAuthService) {
    this.appDom = document.querySelector(this.appName) as HTMLElement;
    this.errors = document.querySelector("#errors") as HTMLDivElement;
    this.appDom.appendChild(this.errors);
  }

  render() {
    this.registerForm = this.createRegisterForm();
    this.loginForm = this.createLoginForm();
    this.logoutForm = this.createLogoutForm();
    this.userInfo = this.createUserInfo();
    this.logoutForm.style.display = "none";
    this.userInfo.style.display = "none";
    if (this.appDom) {
      this.appDom.appendChild(this.registerForm);
      this.appDom.appendChild(this.loginForm);
      this.appDom.appendChild(this.userInfo);
      this.appDom.appendChild(this.logoutForm);
    }
  }

  createError(error: string) {
    const errorDiv = document.createElement("div") as HTMLDivElement;
    errorDiv.innerText = error;
    errorDiv.style.color = "red";
    setTimeout(() => {
      errorDiv.remove();
    }, 2000);
    this.errors.appendChild(errorDiv);
  }

  setTokenCallback(callback: (token: string | undefined) => void) {
    this.tokenCallback = callback;
  }

  setToken(token: string | undefined) {
    this.currentToken = token;
    if (this.tokenCallback) {
      this.tokenCallback(token);
    }
  }

  setLoggedIn() {
    this.updateUserInfo();
    this.registerForm!.style.display = "none";
    this.loginForm!.style.display = "none";
    this.userInfo!.style.display = "block";
    this.logoutForm!.style.display = "block";
  }

  setLoggedOut() {
    this.registerForm!.style.display = "block";
    this.loginForm!.style.display = "block";
    this.userInfo!.style.display = "none";
    this.logoutForm!.style.display = "none";
  }

  createRegisterForm(): HTMLFormElement {
    const form = document.createElement("form") as HTMLFormElement;
    form.style.border = "1px solid black";
    form.style.padding = "10px";

    const heading = document.createElement("h2") as HTMLHeadingElement;
    heading.innerText = "Register";
    form.appendChild(heading);

    const nameInput = document.createElement("input") as HTMLInputElement;
    nameInput.type = "text";
    nameInput.placeholder = "Name";
    form.appendChild(nameInput);

    const emailInput = document.createElement("input") as HTMLInputElement;
    emailInput.type = "email";
    emailInput.placeholder = "Email";
    form.appendChild(emailInput);

    const passwordInput = document.createElement("input") as HTMLInputElement;
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    form.appendChild(passwordInput);

    const registerButton = document.createElement(
      "button"
    ) as HTMLButtonElement;
    registerButton.innerText = "Register";
    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const resp = this.authService.register(name, email, password);
      if (resp.type === ResponseType.Error) {
        this.createError(resp.error as string);
        return;
      }
      this.setToken(resp.data as string);
      this.setLoggedIn();
    });
    form.appendChild(registerButton);

    return form;
  }

  createLoginForm(): HTMLFormElement {
    const form = document.createElement("form") as HTMLFormElement;
    form.style.border = "1px solid black";
    form.style.padding = "10px";

    const heading = document.createElement("h2") as HTMLHeadingElement;
    heading.innerText = "Login";
    form.appendChild(heading);

    const nameInput = document.createElement("input") as HTMLInputElement;
    nameInput.type = "text";
    nameInput.placeholder = "Name";
    form.appendChild(nameInput);

    const passwordInput = document.createElement("input") as HTMLInputElement;
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    form.appendChild(passwordInput);

    const loginButton = document.createElement("button") as HTMLButtonElement;
    loginButton.innerText = "Login";
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      const name = nameInput.value;
      const password = passwordInput.value;
      const resp = this.authService.login(name, password);
      if (resp.type === ResponseType.Error) {
        this.createError(resp.error as string);
        return;
      }
      this.setToken(resp.data as string);
      this.setLoggedIn();
    });
    form.appendChild(loginButton);
    // Add guest login button
    const guestButton = document.createElement("button") as HTMLButtonElement;
    guestButton.innerText = "Login as guest";
    guestButton.addEventListener("click", (e) => {
      e.preventDefault();

      this.setToken(this.authService.createGuest());
      this.setLoggedIn();
    });
    form.appendChild(guestButton);

    return form;
  }

  createLogoutForm(): HTMLFormElement {
    const form = document.createElement("form") as HTMLFormElement;
    form.style.border = "1px solid black";
    form.style.padding = "10px";

    const heading = document.createElement("h2") as HTMLHeadingElement;
    heading.innerText = "Logout";
    form.appendChild(heading);

    const logoutButton = document.createElement("button") as HTMLButtonElement;
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.currentToken) {
        const resp = this.authService.logout(this.currentToken);
        if (resp.type === ResponseType.Error) {
          this.createError(resp.error as string);
          return;
        }
        this.setToken(undefined);
        this.setLoggedOut();
        return;
      }
      this.createError("You are not logged in.");
      return;
    });
    form.appendChild(logoutButton);

    return form;
  }

  createUserInfo(): HTMLDivElement {
    const div = document.createElement("div") as HTMLDivElement;
    div.style.border = "1px solid black";
    div.style.padding = "10px";

    const heading = document.createElement("h2") as HTMLHeadingElement;
    heading.innerText = "User info";
    div.appendChild(heading);

    const userName = document.createElement("label") as HTMLSpanElement;
    userName.style.display = "block";
    userName.id = "user-name";
    div.appendChild(userName);

    const userEmail = document.createElement("label") as HTMLSpanElement;
    userEmail.style.display = "block";
    userEmail.id = "user-email";
    div.appendChild(userEmail);

    const userRole = document.createElement("label") as HTMLSpanElement;
    userRole.style.display = "block";
    userRole.id = "user-role";
    div.appendChild(userRole);

    return div;
  }

  updateUserInfo(): void {
    const name = document.getElementById("user-name") as HTMLSpanElement;
    const email = document.getElementById("user-email") as HTMLSpanElement;
    const role = document.getElementById("user-role") as HTMLSpanElement;
    if (this.currentToken) {
      const resp = this.authService.getUser(this.currentToken);
      if (resp.type === ResponseType.Error) {
        this.createError(resp.error as string);
        return;
      }
      const userInfo = resp.data as User;
      name.innerText = `Name: ${userInfo.name}`;
      email.innerText = `Email: ${userInfo.email}`;
      role.innerText = `Role: ${userInfo.type}`;
      return;
    }
  }
}
