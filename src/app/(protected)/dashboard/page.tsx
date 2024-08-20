import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser } from "@/db/data-access/users";
import { TriangleAlert } from "lucide-react";

export default async function DashboardPage() {
  const currentUser: UserDto = await getCurrentUser();

  if (!currentUser) return <div>User is not authenticated</div>;

  return (
    <div className="container mx-auto pt-8 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-violet-300">Dashboard</h1>
        <p className="text-base text-muted-foreground">
          Welcome {currentUser.firstName} {currentUser.lastName}
        </p>
        <div className="flex flex-col gap-4">
          <Label className="text-lg font-bold">Programming</Label>
          <div className="bg-gradient-to-b from-neutral-800 rounded-xl p-4">
            <div className="flex gap-4 items-center">
              <TriangleAlert className="text-yellow-300/80" />
              <p className="text-sm text-muted-foreground">No programing found for today.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label className="text-lg font-bold">Performance Analyzer</Label>
          <div className="flex gap-4">
            <div className="bg-gradient-to-b from-neutral-800 rounded-xl p-4 w-[50%]"></div>
            <div className="bg-gradient-to-b from-neutral-800 rounded-xl p-4 w-[50%]"></div>
          </div>
          <div className="bg-gradient-to-b from-neutral-800 rounded-xl p-4"></div>
        </div>
        <div className="flex flex-col gap-4">
          <Label className="text-lg font-bold">Lift Percentage Calculator</Label>
          <div className="flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a lift" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="clean">Clean</SelectItem>
                  <SelectItem value="snatch">Snatch</SelectItem>
                  <SelectItem value="powerClean">Power Clean</SelectItem>
                  <SelectItem value="powerSnatch">Power Snatch</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <p>50%</p>
              <p>60%</p>
              <p>70%</p>
              <p>80%</p>
              <p>90%</p>
              <p>95%</p>
            </div>
            <div className="flex gap-4 items-center justify-between">
              <p className="">Custom</p>
              <Input className="" type="number" />
              <Button className="rounded-xl">Calculate</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
