import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { UiContext } from "./uiContextObject.js";
import { SECTORS } from "../mocks/sectors.js";
import { SERVICE_ORDERS } from "../mocks/serviceOrders.js";
import { EQUIPMENT } from "../mocks/equipment.js";
import { BASE_ALERTS } from "../mocks/alerts.js";

export function UiProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [serviceOrders, setServiceOrders] = useState(SERVICE_ORDERS);
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const toastTimerRef = useRef(null);
  const alertSeqRef = useRef(BASE_ALERTS.length);

  const openModal = useCallback((node) => {
    setModalContent(node);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ visible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: "" });
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  // Keeps a runtime alert in the alerts area. Newest alert first.
  const addAlert = useCallback((alert) => {
    alertSeqRef.current += 1;
    setAlerts((prev) => [{ ...alert, id: `alerta-${alertSeqRef.current}` }, ...prev]);
  }, []);

  const selectedSector = useMemo(() => {
    if (!selectedSectorId) return null;
    return SECTORS[selectedSectorId] || null;
  }, [selectedSectorId]);

  const value = useMemo(
    () => ({
      isModalOpen,
      modalContent,
      openModal,
      closeModal,
      selectedSectorId,
      setSelectedSectorId,
      selectedSector,
      serviceOrders,
      setServiceOrders,
      equipment,
      setEquipment,
      alerts,
      addAlert,
      showToast,
      toast,
    }),
    [
      isModalOpen,
      modalContent,
      openModal,
      closeModal,
      selectedSectorId,
      selectedSector,
      serviceOrders,
      equipment,
      alerts,
      addAlert,
      showToast,
      toast,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}