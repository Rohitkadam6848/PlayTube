import { model } from "mongoose";
import postSchema from "./../schemas/postSchema";

const Post = model("Post", postSchema);

export default Post;
