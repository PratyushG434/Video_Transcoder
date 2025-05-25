import { Link } from "react-router-dom"
import { Upload, Play, Users, Video } from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CardContent } from "../components/Card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Share Your Stories</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, share, and discover amazing videos from creators around the world. Join our community and start
            sharing your content today.
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
              <p className="text-gray-600">Drag and drop your videos for instant upload with progress tracking</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">HD Streaming</h3>
              <p className="text-gray-600">Watch videos in high quality with adaptive streaming technology</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Connect with creators and discover content from around the globe</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos Preview */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Recent Uploads</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Sample Video {i}</h4>
                  <p className="text-sm text-gray-600">Preview of uploaded content</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link to="/browse">
            <Button variant="outline" size="lg">
              View All Videos
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
