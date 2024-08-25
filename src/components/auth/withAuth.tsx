import { UserDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser } from "@/db/data-access/users";
import { redirect } from "next/navigation";

export function withAuth(Component: React.ComponentType) {
  return async function WithAuth(props: any) {
    try {
      const currentUser: UserDto = await getCurrentUser();

      console.log(currentUser);

      return <Component {...props} />;
    } catch (error) {
      redirect("/");
    }
  };
}
