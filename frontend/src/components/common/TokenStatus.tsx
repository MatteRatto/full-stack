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
        color: "text-red-800 bg-red-50 border-red-300",
        icon: "⚠️",
        status: "Sessione scaduta",
        message: `${minutesToExpire}min`,
        urgency: "expired",
        showRefresh: false,
      };
    }

    if (minutesToExpire <= 2) {
      return {
        color: "text-red-800 bg-red-50 border-red-300",
        icon: "🚨",
        status: "Sessione critica",
        message: `${minutesToExpire}min`,
        urgency: "critical",
        showRefresh: true,
      };
    }

    if (minutesToExpire <= 5) {
      return {
        color: "text-orange-700 bg-orange-50 border-orange-300",
        icon: "⏰",
        status: "Scadenza imminente",
        message: `${minutesToExpire}min`,
        urgency: "warning",
        showRefresh: true,
      };
    }

    if (minutesToExpire <= 15) {
      return {
        color: "text-yellow-700 bg-yellow-50 border-yellow-300",
        icon: "⚡",
        status: "Sessione in scadenza",
        message: `${minutesToExpire}min`,
        urgency: "caution",
        showRefresh: true,
      };
    }

    return {
      color: "text-green-700 bg-green-50 border-green-300",
      icon: "✅",
      status: "Sessione attiva",
      message: `${minutesToExpire}min`,
      urgency: "active",
      showRefresh: false,
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className={`
        px-2.5 py-1.5 rounded-lg text-xs border flex items-center gap-2
        ${config.color}
        ${config.urgency === "critical" ? "animate-pulse" : ""}
        transition-all duration-300
      `}
    >
      <span className="text-xs">{config.icon}</span>

      <div className="flex items-center gap-1.5">
        <span className="font-medium hidden sm:inline">{config.status}</span>
        <span className="font-medium sm:hidden">Sessione</span>
        <span className="opacity-75">{config.message}</span>
      </div>

      {config.showRefresh && minutesToExpire > 1 && (
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="text-xs px-1.5 py-0.5 bg-white bg-opacity-60 rounded hover:bg-opacity-100 transition-all disabled:opacity-50 ml-auto"
          title="Estendi sessione"
        >
          {isRefreshing ? "⟳" : "🔄"}
        </button>
      )}

      {lastRefresh && (
        <div className="text-xs opacity-60 ml-auto sm:ml-1">
          <span className="hidden sm:inline">Ultimo aggiornamento: </span>
          <span>{lastRefresh.toLocaleTimeString()}</span>
        </div>
      )}

      {serverTokenStatus && (
        <span
          className="text-xs opacity-50 hidden lg:inline"
          title={`Server: ${serverTokenStatus.minutesLeft}min / Local: ${tokenExpirationMinutes}min`}
        ></span>
      )}
    </div>
  );
};

export default TokenStatus;
