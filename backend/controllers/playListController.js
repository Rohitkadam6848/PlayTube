import Channel from "./../models/channelModel.js";
import Video from "./../models/videoModel.js";
import Palylist from "./../models/playlistModel.js";

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        message: "to create playlist title and channelId is required ",
      });

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(400).json({
          message: "channel is not found",
        });
      }

      const videos = await Video.find({
        _id: { $in: videoIds },
        channel: channelId,
      });

      if (videos.length !== videoIds.leength) {
        return res.status(400).json({
          message: "some videos are not found",
        });
      }

      const palylist = await Palylist.create({
        title,
        description,
        channel: channelId,
        videos: videoIds,
      });

      await Channel.findByIdAndUpdate(channelId, {
        $push: { playlists: palylist._id },
      });

      return res.status(201).json(palylist);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `faild to create palylist ${error}` });
  }
};
