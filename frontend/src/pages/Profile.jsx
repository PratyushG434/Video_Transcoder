import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000"; // backend URL

const Profile = () => {
  const { authUser } = useAuthStore.getState();
  const [userVideos, setUserVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.email) return;

   const fetchUserVideos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getAllUserSpecificVideos`, {
      params: { email: authUser.email }, // ✅ Correct way
    });
    setUserVideos(res.data.videos || []);
  } catch (err) {
    console.error("Error fetching user videos:", err);
  }
};


    fetchUserVideos();
  }, [authUser?.email]);

  const handleVideoClick = (video) => {
    navigate(`/watch/${video._id}`, { state: { video } });
  };

  if (!authUser) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-medium text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Section */}
      <div className="flex items-center gap-6 border-b pb-6 mb-8">
        <Avatar className="w-20 h-20 border-2 border-gray-300 shadow-md">
          {authUser.photoURL ? (
            <AvatarImage src={authUser.photoURL} alt={authUser.username} />
          ) : (
            <AvatarFallback className="bg-blue-500 text-white text-2xl font-semibold">
              {authUser.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold">{authUser.username}</h2>
          <p className="text-gray-500">{authUser.email}</p>
        </div>
      </div>

      {/* Uploaded Videos */}
      <h3 className="text-2xl font-semibold mb-6">Your Uploaded Videos</h3>
      {userVideos.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userVideos.map((video) => (
            <div
              key={video._id}
              className="group cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
              onClick={() => handleVideoClick(video)}
            >
              <div className="aspect-video bg-gray-200 relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Thumbnail
                  </div>
                )}
                {/* Play icon overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="w-12 h-12"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 truncate">
                  {video.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {video.description || "No description available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          You haven’t uploaded any videos yet.
        </p>
      )}
    </div>
  );
};

export default Profile;
