import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} MyApp. Tutti i diritti riservati.
          </p>
          <div className="mt-2 flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              Termini di Servizio
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              Contatti
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
