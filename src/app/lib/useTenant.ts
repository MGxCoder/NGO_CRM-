import { useAuth } from "./auth";

/**
 * Returns the tenant identifier for the current user.
 * - New users: the UUID generated at signup and stored in user_metadata.tenant_id
 * - Legacy users (no tenant_id in metadata): falls back to user.id so they
 *   still see their own data after the multi-tenant migration.
 */
export function useTenantId(): string {
  const { user } = useAuth();
  if (!user) return "";
  const metaTenant = user.user_metadata?.tenant_id as string | undefined;
  return metaTenant || user.id;
}
