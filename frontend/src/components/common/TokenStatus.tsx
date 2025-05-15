import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const TokenStatus: React.FC = () => {
  const {
    isAuthenticated,
    tokenExpirationMinutes,
    serverTokenStatus,
    refreshToken,
  } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const result = await refreshToken();
      if (result) {
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error("Manual refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated) return null;

  const minutesToExpire =
    serverTokenStatus?.minutesLeft ?? tokenExpirationMinutes;

  if (minutesToExpire === null || minutesToExpire > 60) return null;

  const getStatusConfig = () => {
    if (minutesToExpire <= 0) {
      return {
        color: "text-red-800 bg-red-50 border-red-400",
        icon: "⚠️",
        title: "Sessione scaduta",
        message: "La tua sessione è scaduta. Verrai reindirizzato al login.",
        urgency: "expired",
        showRefresh: false,
      };
    }

    if (minutesToExpire <= 2) {
      return {
        color: "text-red-800 bg-red-50 border-red-400",
        icon: "🚨",
        title: "Sessione critica",
        message: `${minutesToExpire} minut${
          minutesToExpire > 1 ? "i" : "o"
        } rimanen${minutesToExpire > 1 ? "ti" : "te"}`,
        urgency: "critical",
        showRefresh: true,
      };
    }

    if (minutesToExpire <= 5) {
      return {
        color: "text-red-700 bg-red-50 border-red-300",
        icon: "⏰",
        title: "Scadenza imminente",
        message: `${minutesToExpire} minuti rimanenti`,
        urgency: "warning",
        showRefresh: true,
      };
    }

    if (minutesToExpire <= 15) {
      return {
        color: "text-yellow-700 bg-yellow-50 border-yellow-300",
        icon: "⚡",
        title: "Sessione in scadenza",
        message: `${minutesToExpire} minuti rimanenti`,
        urgency: "caution",
        showRefresh: true,
      };
    }

    return {
      color: "text-green-700 bg-green-50 border-green-300",
      icon: "✅",
      title: "Sessione attiva",
      message: `${minutesToExpire} minuti rimanenti`,
      urgency: "active",
      showRefresh: false,
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className={`
        px-3 py-2 rounded-lg text-sm border-2 flex items-center space-x-2
        ${config.color}
        ${config.urgency === "critical" ? "animate-pulse" : ""}
        transition-all duration-300
      `}
    >
      <span className="text-base">{config.icon}</span>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs">{config.title}</span>

          <div className="flex items-center space-x-1">
            {serverTokenStatus && (
              <span
                className="text-xs opacity-75"
                title="Stato sincronizzato con il server"
              ></span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs opacity-90">{config.message}</span>

          {config.showRefresh && minutesToExpire > 1 && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-xs px-2 py-1 bg-white bg-opacity-80 rounded border hover:bg-opacity-100 transition-all disabled:opacity-50"
              title="Estendi sessione di 30 minuti"
            >
              {isRefreshing ? "⟳" : "🔄 +30min"}
            </button>
          )}
        </div>

        {lastRefresh && (
          <span className="text-xs opacity-60">
            Ultimo aggiornamento: {lastRefresh.toLocaleTimeString()}
          </span>
        )}
      </div>

      {serverTokenStatus && (
        <div className="flex flex-col items-center">
          {serverTokenStatus.isNearExpiration && (
            <span
              className="text-xs text-orange-600"
              title="Vicino alla scadenza"
            >
              ⚠
            </span>
          )}

          <span
            className="text-xs opacity-50"
            title={`Server: ${serverTokenStatus.minutesLeft}min / Local: ${tokenExpirationMinutes}min`}
          >
            S:{serverTokenStatus.minutesLeft}
          </span>
        </div>
      )}
    </div>
  );
};

export default TokenStatus;
