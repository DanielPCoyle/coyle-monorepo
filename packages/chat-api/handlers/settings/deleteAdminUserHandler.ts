import { deleteUser } from "@coyle/chat-db";
import { NextApiRequest, NextApiResponse } from "next";

export async function deleteAdminUsersHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "DELETE") {
      const { id } = JSON.parse(req.body);
      await deleteUser(id);
      res.status(200).json({ message: "User deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default deleteAdminUsersHandler;
