import { ROUTES } from "@/utils/constants";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pagina non trovata - MrApp</title>
        <meta
          name="description"
          content="La pagina che stai cercando non esiste o è stata spostata"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <div className="mt-4">
            <p className="text-xl text-gray-600">Oops! Pagina non trovata</p>
            <p className="mt-2 text-gray-500">
              La pagina che stai cercando non esiste o è stata spostata.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.HOME}
              className="bg-primary-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Torna alla Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              Indietro
            </button>
          </div>

          <div className="mt-12">
            <svg
              className="mx-auto h-32 w-32 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8a8 8 0 100 16 8 8 0 000-16z"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
