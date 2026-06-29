import { useAuth } from "./auth";

export function useTenantId(): string {
  const { user } = useAuth();
  return (user?.user_metadata?.tenant_id as string | undefined) ?? "";
}
