import { pgTable, text } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
// import { InferResultType } from "@/db/schema";

export const lifts = pgTable("lifts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  description: text("description"),
  category: text("category"),
});
