import { model } from "mongoose";
import playlistSchema from "../schemas/playlistSchema.js";

const Palylist = model("Palylist", playlistSchema);

export default Palylist;
