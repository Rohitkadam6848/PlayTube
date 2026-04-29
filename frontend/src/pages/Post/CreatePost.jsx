import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { showCustomAlert } from "../../components/CustomAlert";
import { useSelector } from "react-redux";

function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { channelData } = useSelector((state) => state.user);

  const handelCreatePost = async () => {
    if (!content) {
      showCustomAlert("Post content is required!");
      return;
    }

    const formData = new FormData();
    formData.append();
    try {
    } catch (error) {}
  };
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-20px items-center justify-center">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="Write something for your community..."
          className="w-full p-3 roudned-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-28"
        />

        <label
          htmlFor="image"
          className="flex items-center space-x-3 cursor-pointer"
        >
          <FaImage className="text-2xl items-center space-x-3 cursor-pointer" />
          <span className="text-gray-200">Add Image (optional)</span>
          <input
            onClick={(e) => setImage(e.target.files[0])}
            type="file"
            className="hidden"
            id="image"
            accept="image/*"
          />
        </label>

        {image && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="rounded-lg max-h-64 object-cover"
            />
          </div>
        )}
        <button
          disabled={!content}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-700 flex items-center justify-center"
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
