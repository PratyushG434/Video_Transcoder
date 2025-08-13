import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Video,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Eye,
  Clock,
} from "lucide-react";

import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Badge } from "../components/Badge";

export default function WatchPage() {
  const { id } = useParams();
  const location = useLocation();
  const videoData = location.state?.video;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  if (!videoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          No video data found. Try going back to the{" "}
          <Link to="/browse" className="text-purple-600 underline">
            browse page
          </Link>
          .
        </p>
      </div>
    );
  }

  const formatViews = (views) => {
    if (typeof views !== "number") return "0"; // fallback for missing data
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Video className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">VideoShare</h1>
          </Link>
          <div className="flex gap-2">
            <Link to="/browse">
              <Button variant="outline">Browse</Button>
            </Link>
            <Link to="/upload">
              <Button>Upload</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
              <video
                controls
                preload="metadata"
                className="w-full h-full"
                poster={videoData.thumbnail || "/placeholder.jpg"}
              >
                <source src={videoData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">
                  {videoData.title}
                </h1>
                {videoData.category && (
                  <Badge variant="secondary">{videoData.category}</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(videoData.views)} views</span>
                </div>
                {videoData.uploadedAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{videoData.uploadedAt}</span>
                  </div>
                )}
                {videoData.username && (
                  <span className="font-medium text-gray-800">
                    by {videoData.username}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {videoData.likes + (liked ? 1 : 0)}
                </Button>

                <Button
                  variant={disliked ? "default" : "outline"}
                  size="sm"
                  onClick={handleDislike}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  {videoData.dislikes + (disliked ? 1 : 0)}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Description */}
            {videoData.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {videoData.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
