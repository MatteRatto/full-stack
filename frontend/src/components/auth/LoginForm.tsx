import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PasswordInput from "../ui/passwordInput";

const DemoCredentialsBanner: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">🎭</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Modalità Demo - Credenziali di Test
          </h3>
          <div className="bg-blue-100 rounded p-3 mb-2">
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong>{" "}
                <code className="bg-blue-200 px-1 rounded">demo@demo.com</code>
              </p>
              <p>
                <strong>Password:</strong>{" "}
                <code className="bg-blue-200 px-1 rounded">demo123</code>
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-600">
            💡 Usa queste credenziali per provare l'applicazione senza backend
          </p>
          <div className="mt-2 text-xs text-blue-500">
            <strong>Altre credenziali valide:</strong>
            <br />• marco.bianchi@demo.com / password123
            <br />• test@test.com / test123
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Navigation and errors are handled by AuthContext
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const fillDemoCredentials = () => {
    setValue("email", "demo@demo.com");
    setValue("password", "demo123");
  };

  return (
    <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Accedi al tuo account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Non hai un account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Registrati qui
              </Link>
            </p>
          </div>

          <DemoCredentialsBanner />

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
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

              <PasswordInput
                {...register("password")}
                id="password"
                label="Password"
                placeholder="Password"
                autoComplete="current-password"
                error={errors.password?.message}
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full flex justify-center py-2 px-4 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                🚀 Compila Credenziali Demo
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  "Accedi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
