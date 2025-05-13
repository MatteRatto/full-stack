import React, { useState } from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import PrivateRoute from "@/components/common/PrivateRoute";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Il mio Profilo
              </h1>
            </div>
          </header>

          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <nav className="flex space-x-4">
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
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Profile;
