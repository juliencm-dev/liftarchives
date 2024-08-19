"use server";

import { addUserLift } from "@/db/data-access/lifts";
import { UserLift } from "@/db/schemas/users";
import { ServerResponseMessage } from "@/lib/types";
import { convertWeightToKg } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addUserLiftAction(
  data: FormData
): Promise<ServerResponseMessage> {
  const weightPreference = data.get("weightPreference") as string;
  const convertedWeight = convertWeightToKg(
    Number(data.get("weight") as string),
    weightPreference
  );

  const newUserLift: UserLift = {
    userId: data.get("userId") as string,
    liftId: data.get("liftId") as string,
    oneRepMax: Number(convertedWeight),
    oneRepMaxDate: new Date(),
  } as UserLift;

  try {
    await addUserLift(newUserLift);
    revalidatePath("/lifts");

    return {
      message: "New personnal best added successfully",
      status: 200,
    };
  } catch (error: any) {
    return {
      message: error.message,
      status: 500,
    };
  }
}
