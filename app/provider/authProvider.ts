import { AuthProvider, HttpError } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    if (
      username === "datastax" &&
      password === "astra"
    ) {
      localStorage.setItem("user", username);
      return Promise.resolve();
    } else {
      return Promise.reject(
        new HttpError('Unauthorized', 401, {
            message: 'Invalid username or password',
        })
    );
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
