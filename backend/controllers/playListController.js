import Channel from "./../models/channelModel.js";
import Video from "./../models/videoModel.js";
import Playlist from "./../models/playlistModel.js";

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds = [] } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        message: "Title and channelId are required",
      });
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const videos = await Video.find({
      _id: { $in: videoIds },
      channel: channelId,
    });

    if (videos.length !== videoIds.length) {
      return res.status(400).json({
        message: "Some videos are invalid or not found",
      });
    }

    const playlist = await Playlist.create({
      title,
      description,
      channel: channelId,
      videos: videoIds,
    });

    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create playlist ${error.message}`,
    });
  }
};

export const toggleSavePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.userId;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    if (playlist.savedBy.includes(userId)) {
      playlist.savedBy.pull(userId);
    } else {
      playlist.savedBy.push(userId);
    }

    await playlist.save();

    return res.status(200).json({
      message: "Playlist save status updated",
      playlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to save playlist ${error.message}`,
    });
  }
};
