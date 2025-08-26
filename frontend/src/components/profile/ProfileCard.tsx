import { useAuth } from "@/context/AuthContext";
import { formatDate, getInitials } from "@/utils/helpers";
import React from "react";

const ProfileCard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-500">Dati utente non sono disponibili</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-primary-500 px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {getInitials(user.name)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-primary-100">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Utente
            </label>
            <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
          </div>

          {user.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membro dal
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(user.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
