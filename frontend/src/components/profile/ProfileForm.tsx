import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/utils/validation";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "react-toastify";
import type { User } from "@/types/user.types";

interface ProfileFormProps {
  onUpdateSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onUpdateSuccess }) => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { loading, execute } = useApi<{ user: User }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      const updateData: Partial<ProfileUpdateFormData> = {};

      if (data.name && data.name !== user?.name) {
        updateData.name = data.name;
      }

      if (data.email && data.email !== user?.email) {
        updateData.email = data.email;
      }

      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("Nessuna modifica da salvare");
        setIsEditing(false);
        return;
      }

      const response = await execute("patch", "/auth/profile", updateData);

      if (response.user) {
        setUser(response.user);
        toast.success("Profilo aggiornato con successo!");
        setIsEditing(false);
        reset({
          name: response.user.name,
          email: response.user.email,
          currentPassword: "",
          newPassword: "",
        });
        onUpdateSuccess?.();
      }
    } catch (error: any) {
      toast.error(
        error.message || "Errore durante l'aggiornamento del profilo"
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
    });
  };

  if (!user) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-500">Dati utente non disponibili</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? "Modifica Profilo" : "Informazioni Profilo"}
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Modifica
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            {isEditing ? (
              <>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            {isEditing ? (
              <>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            )}
          </div>

          {isEditing && (
            <>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Cambia Password (Opzionale)
                </h4>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password Attuale
                    </label>
                    <input
                      {...register("currentPassword")}
                      id="currentPassword"
                      type="password"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.currentPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="Inserisci la password attuale"
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nuova Password
                    </label>
                    <input
                      {...register("newPassword")}
                      id="newPassword"
                      type="password"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.newPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="Inserisci la nuova password"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                    {newPassword && (
                      <p className="mt-1 text-xs text-gray-500">
                        La password deve contenere almeno 6 caratteri con una
                        maiuscola, una minuscola e un numero
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Utente
            </label>
            <p className="mt-1 text-sm text-gray-500">#{user.id}</p>
          </div>

          {user.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membro dal
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mx-auto" />
              ) : (
                "Salva Modifiche"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Annulla
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
