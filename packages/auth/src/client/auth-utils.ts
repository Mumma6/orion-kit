import { getAuthToken } from "./utils";

export const createAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const withAuthHeaders = (
  headers: Record<string, string> = {}
): Record<string, string> => {
  return {
    ...headers,
    ...createAuthHeaders(),
  };
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
