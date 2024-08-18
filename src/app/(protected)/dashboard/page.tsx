import { auth } from "@/auth";
import SignOutButton from "@/components/auth/signout-button";

export default async function DashboardPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  return (
    <div>
      <div>DASHBOARD PAGE</div>
      <div>Welcome {user.name}</div>
      <SignOutButton />
    </div>
  );
}
