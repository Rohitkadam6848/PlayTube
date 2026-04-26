import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../models/channelModel.js";
import User from "./../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    return res.status(200).json(user);
  } catch (e) {
    return res
      .status(500)
      .json({ message: `UserController error  is comming ${e}` });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    const existChannel = await Channel.findOne({ owner: userId });

    if (existChannel) {
      return res.status(400).json({ message: "Use  already have a channel " });
    }

    const nameExist = await Channel.findOne({ name });

    if (nameExist) {
      return res.status(400).json({ message: "Name already taken" });
    }
    let avatar;
    let banner;
    if (req.files?.avatar) {
      avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    }
    if (req.files?.banner) {
      banner = await uploadOnCloudinary(req.files.banner[0].path);
    }

    const channel = await Channel.create({
      name,
      description,
      category,
      avatar,
      banner,
      owner: userId,
    });

    await User.findByIdAndUpdate(userId, {
      channel: channel._id,
      username: name,
      photoUrl: avatar,
    });

    return res.status(201).json(channel);
  } catch (error) {
    return res.status(500).json({ message: `create channel error ${error}` });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId });

    if (!channel) {
      return res.status(40).json({ message: " Channel not found " });
    }

    if (name && name !== channel.name) {
      const nameExist = await Channel.findOne({ name });

      if (nameExist) {
        return res.status(400).json({ message: "Name already taken" });
      }
      channel.name = name;
    }

    if (description !== undefined) {
      channel.description = description;
    }

    if (category !== undefined) {
      channel.category = category;
    }

    if (req.files?.avatar) {
      const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
      channel.avatar = avatar;
    }
    if (req.files?.banner) {
      const banner = await uploadOnCloudinary(req.files.banner[0].path);
      channel.banner = banner;
    }

    const updatedChannel = await channel.save();

    await User.findByIdAndUpdate(
      userId,
      {
        username: name || undefined,
        photoUrl: channel.avatar || undefined,
      },
      { new: true },
    );

    return res.status(200).json(updatedChannel);
  } catch (error) {
    return res.status(500).json({ message: `update channel error ${error}` });
  }
};

export const getChannelData = async (req, res) => {
  try {
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")
      .populate("videos")
      .populate("shorts");

    if (!channel) {
      return res.status(404).json({ message: "channel is not found" });
    }

    return res.status(200).json(channel);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Faild to get create channel error ${error}` });
  }
};

export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;

    if (!channelId) {
      return res.status(400).json({ message: "channelId is required" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel is not found" });
    }

    const isSubscribed = channel?.subscribers?.includes(userId);

    if (isSubscribed) {
      channel?.subscribers.pull(userId);
    } else {
      channel?.subscribers.push(userId);
    }

    await channel.save();

    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("videos")
      .populate("shorts");

    return res.status(200).json(updatedChannel);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Faild to toogel subscribe ${error}` });
  }
};

export const getAllChannelData = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner")
      .populate("videos")
      .populate("shorts");

    if (!channels) {
      return res.status(400).json({ message: "Channels are not found" });
    }

    return res.status(200).json(channels);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to getAll channels ${error}` });
  }
};
