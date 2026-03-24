import { model } from "mongoose";
import shortSchema from "../schemas/shortSchema.js";

const Short = model("Short", shortSchema);

export default Short;
