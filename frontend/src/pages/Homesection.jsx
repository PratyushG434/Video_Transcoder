import { Link, useNavigate } from "react-router-dom"
import { Upload, Play, Users, Video, User, Settings, LogOut } from "lucide-react"
import { Button } from "../components/Button"
import { Card, CardContent } from "../components/Card"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/Dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar"

const BASE_URL = "http://localhost:3000" // backend

export default function HomePage() {
  const { authUser, logout } = useAuthStore.getState()
  const [recentVideos, setRecentVideos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecentVideos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getAllVideos`)
        setRecentVideos(res.data.videos.slice(0, 3))
      } catch (err) {
        console.error("Error fetching recent videos:", err)
      }
    }
    fetchRecentVideos()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">VideoShare</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse Videos</Button>
            </Link>
            <Link to="/upload">
              <Button>Upload Video</Button>
            </Link>
            {!authUser ? (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="glass glow ripple">
                    <Avatar className="w-8 h-8">
                     
                      <AvatarFallback>
                        {authUser?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background border border-border rounded-md shadow-md w-56"
                >
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="w-8 h-8">
                    
                      <AvatarFallback>
                        {authUser?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{authUser?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                 
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 flex-1">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Share Your Stories</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, share, and discover amazing videos from creators around the world.
            Join our community and start sharing your content today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-5 w-5" />
                Upload Video
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-5 w-5" />
                Watch Videos
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-gray-600">
                Drag and drop your videos for instant upload with progress tracking
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">HD Streaming</h3>
              <p className="text-gray-600">
                Watch videos in high quality with adaptive streaming technology
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with creators and discover content from around the globe
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
       {/* Recent Videos */}
<div className="text-center">
  <h3 className="text-3xl font-bold text-gray-900 mb-8">Recent Uploads</h3>
  <div className="grid md:grid-cols-3 gap-6 mb-8">
    {recentVideos.length > 0 ? (
      recentVideos.map((video) => (
        <Card
  key={video._id}
  className="overflow-hidden cursor-pointer rounded-xl border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-white"
  onClick={() => navigate(`/watch/${video._id}`, { state: { video } })}
>
  <div className="aspect-video relative bg-gray-200">
    {video.thumbnailUrl ? (
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <Play className="h-12 w-12 text-gray-400" />
      </div>
    )}
  </div>
  <CardContent className="p-4">
    <h4 className="font-semibold text-lg text-gray-900 truncate mb-1">
      {video.title}
    </h4>
    <p className="text-sm text-gray-500 mb-2">by {video.username}</p>
    <p className="text-sm text-gray-600 line-clamp-2">
      {video.description}
    </p>
  </CardContent>
</Card>

      ))
    ) : (
      <p className="text-gray-500">No videos found</p>
    )}
  </div>
  <Link to="/browse">
    <Button variant="outline" size="lg">
      View All Videos
    </Button>
  </Link>
</div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} VideoShare — All rights reserved.
      </footer>
    </div>
  )
}
