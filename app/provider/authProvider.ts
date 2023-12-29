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
    return Promise.resolve({
      id: 'datastax',
      fullName: 'DataStax',
  });
  },
};

export default authProvider;
