
import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  Video,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Eye,
  Clock,
} from "lucide-react"

// UI components (customize or replace with your own styled components)
import { Button } from "../components/Button"
import { Card, CardContent } from "../components/Card"
import { Badge } from "../components/Badge"

// Mock data
const mockVideo = {
  id: 1,
  title: "Amazing Sunset Timelapse",
  description:
    "Beautiful sunset captured over the mountains. This timelapse was shot over 3 hours during golden hour...",
  videoUrl: "/placeholder.mp4",
  duration: "2:34",
  views: 1234,
  likes: 89,
  dislikes: 3,
  uploadedAt: "2 days ago",
  category: "Nature",
  uploader: "NatureFilms",
}

const relatedVideos = [
  {
    id: 2,
    title: "Mountain Hiking Adventure",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "5:20",
    views: 2345,
  },
  {
    id: 3,
    title: "Ocean Waves Relaxation",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "10:15",
    views: 3456,
  },
  {
    id: 4,
    title: "Forest Sounds ASMR",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "8:30",
    views: 1789,
  },
]

export default function WatchPage() {
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-full"
                  poster="/placeholder.jpg"
                >
                  <source src={mockVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">{mockVideo.title}</h1>
                  <Badge variant="secondary">{mockVideo.category}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(mockVideo.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{mockVideo.uploadedAt}</span>
                  </div>
                  <span>by {mockVideo.uploader}</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {mockVideo.likes + (liked ? 1 : 0)}
                  </Button>

                  <Button
                    variant={disliked ? "default" : "outline"}
                    size="sm"
                    onClick={handleDislike}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {mockVideo.dislikes + (disliked ? 1 : 0)}
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>

                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{mockVideo.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Related Videos */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Related Videos</h3>
                <div className="space-y-4">
                  {relatedVideos.map((video) => (
                    <Link key={video.id} to={`/watch/${video.id}`}>
                      <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                          <p className="text-xs text-gray-600">{formatViews(video.views)} views</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
