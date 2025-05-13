import React from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import PrivateRoute from "@/components/common/PrivateRoute";

const Profile: React.FC = () => {
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
                  <ProfileCard />
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
