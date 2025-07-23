import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import authService from "@/services/authService";
import type { User } from "@/types/user.types";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PasswordInput from "../ui/passwordInput";

const ProfileForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const { execute: updateProfile, loading } = useApi<{ user: User }>();
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

      const response = await authService.updateProfile(updateData);

      if (response.data && response.data.user) {
        setUser(response.data.user);
        toast.success("Profilo aggiornato con successo!");

        reset({
          name: response.data.user.name,
          email: response.data.user.email,
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

                <PasswordInput
                  {...register("currentPassword")}
                  id="currentPassword"
                  label="Password Attuale"
                  placeholder="Password attuale"
                  error={errors.currentPassword?.message}
                  required={!!watchNewPassword}
                />

                <PasswordInput
                  {...register("newPassword")}
                  id="newPassword"
                  label="Nuova Password"
                  placeholder="Nuova password"
                  error={errors.newPassword?.message}
                />

                {/* Helper text for password requirements */}
                <p className="text-xs text-gray-500">
                  La password deve contenere almeno 6 caratteri con una
                  maiuscola, una minuscola e un numero
                </p>
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
