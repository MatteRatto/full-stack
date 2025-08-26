import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Helmet>
        <title>
          {isAuthenticated
            ? `Benvenuto ${user?.name} - MrApp`
            : "MrApp - Autenticazione Sicura"}
        </title>
        <meta
          name="description"
          content="MrApp - La tua applicazione per l'autenticazione sicura con JWT"
        />
      </Helmet>

      <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center">
          <div className="max-w-7xl w-full">
            <div className="text-center">
              {isAuthenticated ? (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Benvenuto, {user?.name}!
                  </h2>
                  <p className="text-lg text-gray-600">
                    Sei loggato con successo nella nostra applicazione.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to={ROUTES.PROFILE}
                      className="bg-primary-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Visualizza Profilo
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Benvenuto nella nostra app
                  </h2>
                  <p className="text-lg text-gray-600">
                    Accedi o registrati per iniziare a utilizzare i nostri
                    servizi.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to={ROUTES.LOGIN}
                      className="bg-primary-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Accedi
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors"
                    >
                      Registrati
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sicurezza
                    </h3>
                    <p className="text-sm text-gray-500">
                      Autenticazione sicura con JWT
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Performance
                    </h3>
                    <p className="text-sm text-gray-500">
                      Interfaccia rapida e reattiva
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 3v18M17 21v-7M13 17v7M9 3v4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Analytics
                    </h3>
                    <p className="text-sm text-gray-500">
                      Monitora la tua attività
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
