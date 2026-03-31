import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../models/channelModel.js";
import Short from "../models/short.Model.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        message: "Short title and channelId is required",
      });
    }

    let shortUrl;
    if (req.file) {
      shortUrl = await uploadOnCloudinary(req.file.path);
    }

    const channelData = await Channel.findById(channelId);
    if (!channelData) {
      return res.status(400).json({
        message: "channel is not fround by Id",
      });
    }

    const newShort = await Short.create({
      channel: channelData._id,
      title,
      description,
      shortUrl,
      tags: tags ? JSON.parse(tags) : [],
    });

    await Channel.findByIdAndUpdate(
      channelData._id,
      {
        $push: { shorts: newShort._id },
      },
      { new: true },
    );

    return res.status(201).json(newShort);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to create shortvideo${error}` });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel");
    if (!shorts) {
      return res.status(400).json({ message: `Shorts are not found` });
    }

    return res.status(200).json(shorts);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get short${error}` });
  }
};

export const toggleLikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "Short is not found" });
    }
    if (short.likes.includes(userId)) {
      short.likes.pull(userId);
    } else {
      short.likes.push(userId);
      short.disLikes.pull(userId);
    }

    await short.populate("channel");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Faild to like short${error}` });
  }
};

export const toggleDislikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short is not found" });
    }

    if (short.disLikes.includes(userId)) {
      short.disLikes.pull(userId);
    } else {
      short.disLikes.push(userId);
      short.likes.pull(userId);
    }
    await short.populate("channel");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Faild to dislike short${error}` });
  }
};

export const toggleSave1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short is not found" });
    }

    if (short.saveBy.includes(userId)) {
      short.saveBy.pull(userId);
    } else {
      short.saveBy.push(userId);
    }
    await short.populate("channel");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Faild to save short${error}` });
  }
};

export const getViews1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Short.findByIdAndUpdate(
      shortId,
      {
        $inc: { views: 1 },
      },
      { new: true },
    );

    if (!short) {
      return res.status(400).json({ message: "short is not found" });
    }
    await short.populate("channel");

    return res.status(200).json(short);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Faild to get views short${error}` });
  }
};

export const addComment1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short is not found" });
    }

    short.comments.push({ author: userId, message });

    await short.save();

    const populatedShort = await Short.findById(shortId)
      .populate({
        path: "comments.author",
        select: "username photourl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email ",
      });

    return res.status(200).json(populatedShort);
  } catch (error) {
    return res.status(500).json({ message: `Failed to add comment ${error}` });
  }
};

export const addReply1 = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = short.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      author: userId,
      message,
    });

    await short.save();

    await short.populate([
      {
        path: "comments.author",
        select: "username photourl email",
      },
      {
        path: "comments.replies.author",
        select: "username photourl email",
      },
    ]);

    return res.status(200).json(short);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to add reply: ${error.message}` });
  }
};
