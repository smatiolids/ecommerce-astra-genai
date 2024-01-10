import { AuthProvider, HttpError } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    if (
      username === process.env.NEXT_PUBLIC_APP_USER &&
      password === process.env.NEXT_PUBLIC_APP_PASS
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
      id: process.env.NEXT_PUBLIC_APP_USER as string,
      fullName: 'DataStax Astra DB Vector',
  });
  },
};

export default authProvider;
