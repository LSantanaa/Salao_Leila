import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});