import { model } from "mongoose";
import postSchema from "./../schemas/postSchema.js";

const Post = model("Post", postSchema);

export default Post;
