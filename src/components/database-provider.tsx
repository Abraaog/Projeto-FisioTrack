import { useDatabaseMigration } from "@/hooks/useDatabaseMigration";

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  useDatabaseMigration();
  return <>{children}</>;
}