import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import "./App.css";

import HomePage from "./pages/Homesection";
import UploadPage from "./pages/Upload";
import WatchPage from "./pages/videoid";
import BrowsePage from "./pages/Stream";
import LoginPage from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import Profile from "./pages/Profile";
 
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  console.log(authUser);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/upload"
          element={authUser ? <UploadPage /> : <Navigate to="/login" />}
        />
         <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/browse" element={<BrowsePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
