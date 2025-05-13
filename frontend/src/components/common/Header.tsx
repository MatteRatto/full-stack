import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to MyApp</h1>
        <p className="mt-2 text-primary-100">
          La tua applicazione per l'autenticazione sicura
        </p>
      </div>
    </header>
  );
};

export default Header;
