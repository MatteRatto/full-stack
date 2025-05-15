import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import { ROUTES } from "@/utils/constants";
import TokenStatus from "./TokenStatus";

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary-600">MyApp</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <TokenStatus />
                <span className="text-gray-700 font-medium">
                  Ciao, {user?.name}
                </span>
                <Link
                  to={ROUTES.PROFILE}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.PROFILE)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Profilo
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.LOGIN)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Accedi
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors ${
                    isActive(ROUTES.REGISTER) ? "ring-2 ring-primary-500" : ""
                  }`}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
