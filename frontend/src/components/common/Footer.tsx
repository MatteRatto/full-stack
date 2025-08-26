import React, { useEffect, useRef, useState } from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showContactsMenu, setShowContactsMenu] = useState(false);
  const contactsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactsMenuRef.current &&
        !contactsMenuRef.current.contains(event.target as Node)
      ) {
        setShowContactsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const contactOptions = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/matteo-ratto-b7b0502b0/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com/MatteRatto",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} MR app. Tutti i diritti riservati.
          </p>

          <div className="hidden sm:block">
            <div className="mt-2 flex justify-center space-x-6">
              <div className="relative" ref={contactsMenuRef}>
                <button
                  onClick={() => setShowContactsMenu(!showContactsMenu)}
                  className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
                >
                  Contatti
                </button>

                {showContactsMenu && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-10">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Contattami su
                    </div>
                    {contactOptions.map((contact, index) => (
                      <a
                        key={index}
                        href={contact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        onClick={() => setShowContactsMenu(false)}
                      >
                        <span className="mr-3 text-gray-400 group-hover:text-primary-500">
                          {contact.icon}
                        </span>
                        {contact.name}
                      </a>
                    ))}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-200 mt-px"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:hidden">
            <div className="mt-3 space-y-2">
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 transition-colors text-sm"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 transition-colors text-sm"
                >
                  Termini
                </a>
              </div>

              <div className="flex justify-center space-x-4">
                {contactOptions.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    title={contact.name}
                  >
                    {contact.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
