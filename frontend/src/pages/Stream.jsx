import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/Button"
import { Card, CardContent } from "../components/Card"
import { Input } from "../components/Input"
import { Badge } from "../components/Badge"
import { Video, Search, Play, Clock, Eye } from "lucide-react"

const mockVideos = [
  {
    id: 1,
    title: "Amazing Sunset Timelapse",
    description: "Beautiful sunset captured over the mountains",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "2:34",
    views: 1234,
    uploadedAt: "2 days ago",
    category: "Nature",
  },
  {
    id: 2,
    title: "Cooking Tutorial: Perfect Pasta",
    description: "Learn how to make restaurant-quality pasta at home",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "8:45",
    views: 5678,
    uploadedAt: "1 week ago",
    category: "Cooking",
  },
  {
    id: 3,
    title: "City Life Documentary",
    description: "Exploring urban culture and daily life",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "15:22",
    views: 9876,
    uploadedAt: "3 days ago",
    category: "Documentary",
  },
  {
    id: 4,
    title: "Guitar Lesson: Beginner Chords",
    description: "Master the basic guitar chords every beginner needs",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "12:18",
    views: 3456,
    uploadedAt: "5 days ago",
    category: "Music",
  },
  {
    id: 5,
    title: "Travel Vlog: Tokyo Adventure",
    description: "Exploring the streets of Tokyo and trying local food",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "18:30",
    views: 7890,
    uploadedAt: "1 day ago",
    category: "Travel",
  },
  {
    id: 6,
    title: "Tech Review: Latest Smartphone",
    description: "In-depth review of the newest flagship phone",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "11:45",
    views: 4567,
    uploadedAt: "4 days ago",
    category: "Technology",
  },
]

const categories = ["All", "Nature", "Cooking", "Documentary", "Music", "Travel", "Technology"]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
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

        {/* Search and Filters */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Link key={video.id} to={`/watch/${video.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {video.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(video.views)} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
