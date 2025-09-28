import { DatabaseProvider } from "@/hooks/useDatabaseMigration";

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return <DatabaseProvider>{children}</DatabaseProvider>;
}