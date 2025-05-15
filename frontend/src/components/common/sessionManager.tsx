import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import SessionExpirationModal from "./sessionExpiratedModal";
import TokenStatus from "./TokenStatus";
import { toast } from "react-toastify";

const SessionManager: React.FC = () => {
  const {
    isAuthenticated,
    tokenExpirationMinutes,
    serverTokenStatus,
    refreshToken,
  } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalShownForMinute, setModalShownForMinute] = useState<number | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || tokenExpirationMinutes === null) {
      setShowModal(false);
      setModalShownForMinute(null);
      return;
    }

    const currentMinutes =
      serverTokenStatus?.minutesLeft ?? tokenExpirationMinutes;

    // Se abbiamo appena refreshato e ora abbiamo più di 25 minuti, chiudi il modal
    if (refreshedRef.current && currentMinutes > 25) {
      console.log(
        "Token refreshed, closing modal. Minutes left:",
        currentMinutes
      );
      setShowModal(false);
      setModalShownForMinute(null);
      refreshedRef.current = false;
      return;
    }

    if (currentMinutes <= 0) {
      setShowModal(false);
      setModalShownForMinute(null);
      refreshedRef.current = false;
      return;
    }

    // Non mostrare il modal se stiamo refreshando o abbiamo appena refreshato
    if (isRefreshing || refreshedRef.current) {
      return;
    }

    // Show modal at critical times: 15, 10, 5, 2, 1 minutes
    const shouldShowModal =
      currentMinutes <= 15 &&
      currentMinutes > 0 &&
      modalShownForMinute !== currentMinutes;

    if (shouldShowModal) {
      const criticalTimes = [15, 10, 5, 2, 1];

      const shouldShow =
        criticalTimes.includes(currentMinutes) ||
        (serverTokenStatus?.isNearExpiration && currentMinutes <= 5);

      if (shouldShow) {
        setShowModal(true);
        setModalShownForMinute(currentMinutes);
      }
    }
  }, [
    isAuthenticated,
    tokenExpirationMinutes,
    serverTokenStatus,
    modalShownForMinute,
    isRefreshing,
  ]);

  const handleExtendSession = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      console.log("SessionManager: Starting token refresh...");
      const result = await refreshToken();

      if (result) {
        console.log("SessionManager: Token refresh successful");

        // Imposta il flag per indicare che abbiamo refreshato
        refreshedRef.current = true;

        // Chiudi il modal immediatamente
        setShowModal(false);
        setModalShownForMinute(null);

        // Aspetta un momento per permettere all'AuthContext di aggiornare lo stato
        setTimeout(() => {
          console.log("SessionManager: Checking updated values...");
          console.log(
            "Current minutes after refresh:",
            serverTokenStatus?.minutesLeft ?? tokenExpirationMinutes
          );
        }, 500);

        toast.success("Sessione estesa di 30 minuti con successo!");
        console.log(
          "SessionManager: Session extended successfully - modal should be closed"
        );
      } else {
        toast.error("Impossibile estendere la sessione");
        console.error("SessionManager: Token refresh failed");
        refreshedRef.current = false;
      }
    } catch (error) {
      toast.error("Errore durante l'estensione della sessione");
      console.error("SessionManager: Failed to extend session:", error);
      refreshedRef.current = false;
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isRefreshing && !refreshedRef.current) {
    }
  };

  if (!isAuthenticated) return null;

  const minutesLeft =
    serverTokenStatus?.minutesLeft ?? tokenExpirationMinutes ?? 0;

  return (
    <>
      <SessionExpirationModal
        isOpen={showModal && !isRefreshing}
        onClose={handleCloseModal}
        minutesLeft={minutesLeft}
        onExtendSession={isRefreshing ? undefined : handleExtendSession}
      />

      {isRefreshing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Estendendo sessione...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;
