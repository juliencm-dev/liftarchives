import { UserDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser } from "@/db/data-access/users";
import { redirect } from "next/navigation";

export function withAuth(Component: React.ComponentType) {
  return async function WithAuth(props: any) {
    const currentUser: UserDto = await getCurrentUser();
    if (!currentUser) return redirect("/");

    if (currentUser.accountSetupAt === "") {
      return redirect("/account/setup");
    }

    return <Component {...props} />;
  };
}
