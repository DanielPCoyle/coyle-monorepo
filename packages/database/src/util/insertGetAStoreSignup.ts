import { getDB } from "@coyle/database";
import { getAStoreSignUps } from "@coyle/database/schema";

export const insertGetAStoreSignup = async (insert) => {
  try {
    const db = getDB();
    const result = await db
      .insert(getAStoreSignUps)
      .values(insert)
      .returning()
      .execute();
    return result;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
