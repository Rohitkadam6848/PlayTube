import { model } from "mongoose";
import channelSchema from "../schemas/channelSchema.js";

const Channel = model("Channel", channelSchema);

export default Channel;
