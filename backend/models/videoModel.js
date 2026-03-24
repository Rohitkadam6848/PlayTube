import { model } from "mongoose";
import videoSchema from "../schemas/videoSchema.js";

const Video = model("Video", videoSchema);

export default Video;
