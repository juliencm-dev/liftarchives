import { CompetitionCategoryDetailsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { Label } from "../ui/label";
import { CircleAlert } from "lucide-react";
import { convertWeightToLbs } from "@/lib/utils";

interface CompetitionDetailsProps {
  currentTotal: number | null;
  competitionCategoryDetails: CompetitionCategoryDetailsDto;
  userInformations: UserInformationDto;
}

export default function CompetitionDetails(props: CompetitionDetailsProps) {
  return (
    <div className='flex flex-col gap-4'>
      <Label className='text-lg font-bold'>Competition Details</Label>
      <div className='flex flex-col bg-gradient-to-b from-neutral-800 rounded-xl p-4 gap-4'>
        <h3 className='text-base font-semibold'>
          {props.competitionCategoryDetails.name}
        </h3>
        <p className='text-xs text-muted-foreground'>
          This category is selected based on your year of birth and current
          weight.
        </p>
        <div className='flex justify-around bg-neutral-700/50 p-2 rounded-xl'>
          <div>
            <h4 className='text-sm font-semibold'>Current Total: </h4>
            <div className='flex gap-2 items-center justify-between text-red-400 font-bold'>
              <p className='text-xl'>
                {props.currentTotal === null
                  ? "--"
                  : Number(
                      convertWeightToLbs(
                        props.currentTotal,
                        props.userInformations.liftsUnit
                      )
                    ).toFixed(2)}{" "}
                {props.userInformations.liftsUnit}
              </p>
              <CircleAlert />
            </div>
          </div>
          <div>
            <h4 className='text-sm font-semibold'>Required Total :</h4>
            <span className='text-xl text-violet-300 font-bold'>
              {props.competitionCategoryDetails.total === null
                ? "--"
                : Number(
                    convertWeightToLbs(
                      props.competitionCategoryDetails.total,
                      props.userInformations.liftsUnit
                    )
                  ).toFixed(2)}{" "}
              {props.userInformations.liftsUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
