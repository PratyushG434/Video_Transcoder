import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Video, Search, Play, Clock, Eye } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // backend

const categories = ["All", "Nature", "Cooking", "Documentary", "Music", "Travel", "Technology"];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setError("");
        const res = await axios.get(`${BASE_URL}/getAllVideos`);
        if (Array.isArray(res.data)) {
          setVideos(res.data);
          console.log(res.data);
        } else {
          console.warn("Unexpected response format:", res.data);
          setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please check your connection or try again later.");
        setVideos([]); // Prevent crash on map
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Filter logic
  const filteredVideos = videos.filter((video) => {
    const titleMatch = video?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = video?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatViews = (views) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views?.toString() || "0";
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading videos...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Video className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">VideoShare</h1>
          </Link>
          <Link to="/upload">
            <Button>Upload Video</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Videos</h2>
          <p className="text-gray-600">Discover amazing content from our community</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Link key={video.id}
               to={`/watch/${video._id}`}
               state={{ video }} 
               >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                      {video.category && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {video.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        {video.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatViews(video.views)} views</span>
                          </div>
                        )}
                        {video.uploadedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{video.uploadedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
