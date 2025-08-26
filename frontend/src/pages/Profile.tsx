import PrivateRoute from "@/components/common/PrivateRoute";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>
          {user?.name
            ? `Profilo di ${user.name} - MrApp`
            : "Il mio Profilo - MrApp"}
        </title>
        <meta
          name="description"
          content="Visualizza e modifica le informazioni del tuo profilo utente"
        />
      </Helmet>

      <PrivateRoute>
        <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Il mio Profilo
              </h1>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <nav className="flex justify-center space-x-4">
                  <button
                    onClick={() => setActiveTab("view")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "view"
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Visualizza Profilo
                  </button>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "edit"
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Modifica Profilo
                  </button>
                </nav>
              </div>

              {activeTab === "view" ? <ProfileCard /> : <ProfileForm />}
            </div>
          </div>
        </div>
      </PrivateRoute>
    </>
  );
};

export default Profile;
