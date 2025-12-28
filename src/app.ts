import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth)); // Mount the auth handler (better-auth)

app.use(express.json());

app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World !");
});

export default app;
