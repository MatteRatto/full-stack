import React from "react";
import { useAuth } from "@/context/AuthContext";

interface SessionExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesLeft: number;
  onExtendSession?: () => void;
}

const SessionExpirationModal: React.FC<SessionExpirationModalProps> = ({
  isOpen,
  onClose,
  minutesLeft,
  onExtendSession,
}) => {
  const { logout } = useAuth();

  if (!isOpen) return null;

  const getUrgencyConfig = () => {
    if (minutesLeft <= 2) {
      return {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        iconBg: "bg-red-100",
        icon: "🚨",
        title: "Sessione in scadenza critica!",
        description:
          "La tua sessione scadrà molto presto. Salva immediatamente tutti i cambiamenti non salvati.",
        buttonColor: "bg-red-600 hover:bg-red-700",
      };
    }

    if (minutesLeft <= 5) {
      return {
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        iconBg: "bg-orange-100",
        icon: "⚠️",
        title: "Attenzione: sessione in scadenza",
        description:
          "La tua sessione scadrà a breve. Ti consigliamo di salvare il tuo lavoro.",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
      };
    }

    return {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      icon: "ℹ️",
      title: "Notifica scadenza sessione",
      description:
        "La tua sessione scadrà tra poco. Puoi continuare a lavorare o estendere la sessione di altri 30 minuti.",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    };
  };

  const config = getUrgencyConfig();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`max-w-md w-full mx-4 rounded-lg shadow-xl ${config.bgColor} ${config.borderColor} border-2`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${config.iconBg}`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {config.title}
              </h3>
              <p className="text-sm text-gray-600">
                Rimangono {minutesLeft} minut{minutesLeft > 1 ? "i" : "o"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {config.description}
            </p>

            {minutesLeft <= 5 && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Cosa succede dopo:</strong>
                  <br />
                  • La sessione scadrà automaticamente
                  <br />
                  • Verrai reindirizzato alla pagina di login
                  <br />• I dati non salvati potrebbero essere persi
                </p>
              </div>
            )}

            {onExtendSession && minutesLeft > 2 && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>💡 Suggerimento:</strong> Clicca su "Estendi sessione"
                  per aggiungere altri 30 minuti alla tua sessione attuale.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {onExtendSession && minutesLeft > 2 && (
              <button
                onClick={onExtendSession}
                className={`flex-1 px-4 py-2 text-white font-medium rounded ${config.buttonColor} transition-colors flex items-center justify-center space-x-2`}
              >
                <span>🔄</span>
                <span>Estendi +30min</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
            >
              Continua
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700 transition-colors"
            >
              Logout ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpirationModal;
