import { auth } from "@/auth";

export default async function AccountPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  return <div>ACCOUNT PAGE</div>;
}
