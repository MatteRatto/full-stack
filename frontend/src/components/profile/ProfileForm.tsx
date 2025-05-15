import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/utils/validation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "react-toastify";
import { useApi } from "@/hooks/useApi";
import type { User } from "@/types/user.types";

const ProfileForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const { execute: updateProfile, loading } = useApi<{ user: User }>();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

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
      currentPassword: "",
      newPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword");

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      const updateData: Partial<ProfileUpdateFormData> = {};

      if (data.name && data.name.trim() !== user?.name) {
        updateData.name = data.name.trim();
      }

      if (data.email && data.email.trim() !== user?.email) {
        updateData.email = data.email.trim();
      }

      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("Nessuna modifica da salvare");
        return;
      }

      console.log("Making request to:", "/auth/profile");
      console.log("With data:", updateData);

      const response = await updateProfile("put", "/auth/profile", updateData);

      if (response.user) {
        setUser(response.user);
        toast.success("Profilo aggiornato con successo!");

        reset({
          name: response.user.name,
          email: response.user.email,
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(
        error.message || "Errore durante l'aggiornamento del profilo"
      );
    }
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
      <div className="bg-primary-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Modifica Profilo</h2>
        <p className="text-primary-100 text-sm">
          Aggiorna le tue informazioni personali
        </p>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <div className="mt-1">
              <input
                {...register("name")}
                type="text"
                id="name"
                className={`block w-full px-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Il tuo nome"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="La tua email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                Cambia Password
              </span>
              <svg
                className={`w-4 h-4 text-gray-600 transform transition-transform duration-200 ${
                  showPasswordSection ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showPasswordSection && (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-gray-500">
                  Lascia vuoti i campi password se non vuoi cambiarla
                </p>

                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password Attuale
                    {watchNewPassword && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register("currentPassword")}
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      className={`block w-full px-3 py-2 pr-10 border ${
                        errors.currentPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="Password attuale"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
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
                  <div className="mt-1 relative">
                    <input
                      {...register("newPassword")}
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className={`block w-full px-3 py-2 pr-10 border ${
                        errors.newPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="Nuova password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    La password deve contenere almeno 6 caratteri con una
                    maiuscola, una minuscola e un numero
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Aggiornamento...
                </div>
              ) : (
                "Aggiorna Profilo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
