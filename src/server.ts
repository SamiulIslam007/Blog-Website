import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  const PORT = process.env.PORT || 5000;

  try {
    await prisma.$connect();
    console.log("Connected to database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
