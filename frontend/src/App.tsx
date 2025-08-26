import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import { ROUTES } from "@/utils/constants";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import SessionManager from "./components/common/sessionManager";
import CreatePost from "./components/post/CreatePost";
import EditPost from "./components/post/EditPost";
import MyPosts from "./components/post/MyPost";
import Posts from "./components/post/Post";
import SinglePost from "./components/post/SinglePost";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="App min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.POSTS} element={<Posts />} />
                <Route path={ROUTES.CREATE_POST} element={<CreatePost />} />
                <Route path={ROUTES.MY_POSTS} element={<MyPosts />} />
                <Route path="/posts/:id" element={<SinglePost />} />
                <Route path="/posts/edit/:id" element={<EditPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />

            <SessionManager />

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
