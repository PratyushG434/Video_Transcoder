import React, { useState, useCallback, useRef } from "react";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Label } from "../components/label";
import axios from "axios";
import { Textarea } from "../components/Textarea";
import { Progress } from "../components/progress";
import { Upload, Video, X, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { authUser } = useAuthStore.getState();
  const fileInputRef = useRef(null);

  const categories = [
    { id: 1, name: "Education" },
    { id: 2, name: "Entertainment" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Gaming" },
    { id: 5, name: "Lifestyle" },
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      setFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      setFile(files[0]);
    }
  };


const handleUpload = async () => {
  if(!authUser)
  {
    alert("You are required to sign in before uploading video");
  }
  if (!file || !title || !category) {
    alert("Please fill all required fields including category.");
    return;
  }

  setUploading(true);
  setUploadProgress(0);
  setUploadComplete(false);

  try {
    // 1. Request signed URL from backend
    const response = await axios.post("http://localhost:3000/uploadVideoRequest", {
      username: authUser.name, // Replace with real user data
      email: authUser.email, // Replace with real email
      title,
      description,
      category,
      filetype: file.type,
    });

    const { uploadUrl, videoId } = response.data;
    console.log(uploadUrl);
    // 2. Upload file to S3 via signed URL with progress tracking
    await axios.put(uploadUrl, file, {
      headers: {},
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      },
    });

    setUploadProgress(100);
    setUploadComplete(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setUploading(false);
      setUploadProgress(0);
      setUploadComplete(false);
    }, 3000);
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
    setUploading(false);
    setUploadProgress(0);
  }
};

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
          <Link to="/browse">
            <Button variant="outline">Browse Videos</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Video</h2>
          <p className="text-gray-600">Share your content with the world</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your video here</h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                    ref={fileInputRef}
                  />
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Supports MP4, MOV, AVI up to 100MB</p>
                </>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile} disabled={uploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Video Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                  className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video"
                  rows={4}
                  disabled={uploading}
                />
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Success Message */}
            {uploadComplete && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span>Video uploaded successfully!</span>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !title || !category || uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}