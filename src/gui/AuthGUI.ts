import { User } from "../entities/User";
import { ResponseType } from "../helpers/Response";
import { IAuthService } from "../services/interfaces";

export class AuthGUI {
  currentToken?: string;
  appDom: HTMLElement;
  dialogs: HTMLDivElement;
  registerForm?: HTMLFormElement;
  loginForm?: HTMLFormElement;
  logoutForm?: HTMLFormElement;
  userInfo?: HTMLDivElement;
  tokenCallback?: (token: string | undefined) => void;
  rerenderCallback?: () => void;
  constructor(private appName: string, private authService: IAuthService) {
    this.appDom = document.querySelector(this.appName) as HTMLElement;
    this.dialogs = document.querySelector("#dialogs") as HTMLDivElement;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    wrapper.style.justifyContent = "space-evenly";
    this.registerForm = this.createRegisterForm();
    this.registerForm.style.width = "100%";
    wrapper.appendChild(this.registerForm);

    this.loginForm = this.createLoginForm();
    this.loginForm.style.width = "100%";
    wrapper.appendChild(this.loginForm);

    this.userInfo = this.createUserInfo();
    wrapper.appendChild(this.userInfo);
    this.userInfo.style.width = "100%";

    this.logoutForm = this.createLogoutForm();
    wrapper.appendChild(this.logoutForm);
    this.logoutForm.style.width = "100%";

    this.logoutForm.style.display = "none";
    this.userInfo.style.display = "none";
    if (this.appDom) {
      this.appDom.appendChild(wrapper);
    }
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

  setRerenderCallback(callback: () => void) {
    this.rerenderCallback = callback;
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
    if (this.rerenderCallback) {
      this.rerenderCallback();
    }
    this.createSuccess("Logged in");
  }

  setLoggedOut() {
    this.registerForm!.style.display = "block";
    this.loginForm!.style.display = "block";
    this.userInfo!.style.display = "none";
    this.logoutForm!.style.display = "none";
    if (this.rerenderCallback) {
      this.rerenderCallback();
    }
    this.createSuccess("Logged out");
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
