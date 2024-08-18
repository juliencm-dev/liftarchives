import { auth } from "@/auth";

export default async function DashboardPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  return <div>PROGRAM PAGE</div>;
}
