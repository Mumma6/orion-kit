import {
  getKindeServerSession,
  handleAuth,
} from "@kinde-oss/kinde-auth-nextjs/server";
export { handleAuth };

export { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
/**
 * Get the current authentication session
 * @returns Promise<KindeSession | null>
 */
export const auth: typeof getKindeServerSession = getKindeServerSession;

/**
 * Get the current user from the session
 * @returns Promise<KindeUser | null>
 */
export const currentUser = async () => {
  const session = getKindeServerSession();
  return (await session?.getUser()) || null;
};

/**
 * Get the current user's ID
 * @returns Promise<string | null>
 */
export const getUserId = async () => {
  const session = await getKindeServerSession();
  const user = await session?.getUser();
  return user?.id || null;
};

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export const isAuthenticated = async () => {
  const session = await getKindeServerSession();
  return (await session?.isAuthenticated()) || false;
};

/**
 * Get user permissions
 * @returns Promise<string[]>
 */
export const getPermissions = async () => {
  const session = await getKindeServerSession();
  const permissions = await session?.getPermissions();
  return permissions?.permissions || [];
};

/**
 * Check if user has specific permission
 * @param permission - The permission to check
 * @returns Promise<boolean>
 */
export const hasPermission = async (permission: string) => {
  const session = await getKindeServerSession();
  const permissionResult = await session?.getPermission(permission);
  return permissionResult?.isGranted || false;
};

/**
 * Get user organization
 * @returns Promise<KindeOrganization | null>
 */
export const getOrganization = async () => {
  const session = await getKindeServerSession();
  return session?.getOrganization() || null;
};

// Re-export Kinde types
export type {
  KindeUser as User,
  KindeOrganization as Organization,
  KindeState as Session,
} from "@kinde-oss/kinde-auth-nextjs/types";
