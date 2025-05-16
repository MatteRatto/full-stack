import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { registerSchema, type RegisterFormData } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PasswordInput from "../ui/passwordInput";

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Crea il tuo account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hai già un account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Accedi qui
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`mt-1 block w-full px-3 py-2 border ${
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

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Indirizzo email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <PasswordInput
                  {...register("password")}
                  id="password"
                  label="Password"
                  placeholder="Password"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  La password deve contenere almeno 6 caratteri con una
                  maiuscola, una minuscola e un numero
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  "Registrati"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
