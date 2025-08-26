import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import SessionManager from "./components/common/sessionManager";

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
