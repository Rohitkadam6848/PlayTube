import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const commentSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      required: true,
    },

    replies: [replySchema], // FIXED
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema], // FIXED
  },
  { timestamps: true },
);

export default postSchema;
