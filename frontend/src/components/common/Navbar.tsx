import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import { ROUTES } from "@/utils/constants";
import TokenStatus from "./TokenStatus";

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex-shrink-0 flex items-center">
              <h1 className="text-lg font-bold text-primary-600">MR app</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <TokenStatus />
                <span className="text-gray-700 text-sm hidden lg:inline">
                  Ciao, {user?.name}
                </span>
                <span className="text-gray-700 text-sm lg:hidden">
                  {user?.name}
                </span>
                <Link
                  to={ROUTES.PROFILE}
                  className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
                  className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.LOGIN)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Accedi
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className={`px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors ${
                    isActive(ROUTES.REGISTER) ? "ring-2 ring-primary-500" : ""
                  }`}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <TokenStatus />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Apri menu principale</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500">
                  Ciao, {user?.name}
                </div>
                <Link
                  to={ROUTES.PROFILE}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.PROFILE)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profilo
                </Link>
                <div className="px-3 py-2">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.LOGIN)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accedi
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className={`block mx-3 my-2 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors text-center ${
                    isActive(ROUTES.REGISTER) ? "ring-2 ring-primary-500" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
