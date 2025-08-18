# 🎥 Video Transcoder & Streaming App

A lightweight web application for **video uploading, transcoding, and adaptive streaming** using **HLS (HTTP Live Streaming)** with multiple bitrates. Designed for seamless video playback across devices and optimized for efficient bandwidth usage.

---

## ✨ Features

- 📤 **Easy Uploads** – Drag & drop or select video files from your system.  
- ⚡ **Automatic Transcoding** – Videos are transcoded into multiple bitrates for adaptive streaming.  
- 🎞️ **HLS Streaming** – Streams are served in `.m3u8` format for smooth playback.  
- 📱 **Adaptive Bitrate Switching** – Optimized for unstable/low bandwidth connections.  
- 🌍 **Cross-Platform Playback** – Works on desktop, mobile, and smart TVs.  
- ☁️ **AWS Integration** – Upload videos directly to AWS S3 through presigned urls for scalable storage.  

---

## 🛠️ Tech Stack

- **Backend**: Node.js / Express.js  
- **Video Processing**: [FFmpeg](https://ffmpeg.org/)  
- **Streaming Protocol**: HLS (m3u8 playlists + .ts segments)  
- **Frontend**: React.js + video.js 
- **Storage**: Local / AWS S3 (configurable)  

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/PratyushG434/Video_Transcoder.git
cd Video_Transcoder
```
### 2️⃣ Start the backend

```bash
cd backend
npm install
nodemon index.js
```
### 3️⃣ Start the frotend

```bash
cd frontend
npm install
npm run dev
```

