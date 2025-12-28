import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {
  res.send("Create a new post");
};

export const postController = {
  createPost,
};
