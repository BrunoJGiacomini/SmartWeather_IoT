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
import { BASE_ALERTS, buildRainAlert } from "../mocks/alerts.js";
import {
  applyRainSimulation,
  resolveSimulation,
} from "../utils/rainSimulation.js";

export function UiProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [serviceOrders, setServiceOrders] = useState(SERVICE_ORDERS);
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [rainSimulations, setRainSimulations] = useState([]);
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

  // Simulates rain on a station: marks the area as simulated (the "Simular
  // chuva" button of that area gets disabled), reschedules the service order
  // when it is a scheduled mowing, and registers the alert.
  const simulateRain = useCallback(
    (station) => {
      if (!station?.simulacao) return null;
      if (rainSimulations.includes(station.nome)) return null;

      const { serviceOrders: nextOrders, changed, previousDate, newDate } =
        applyRainSimulation(serviceOrders, station);

      setServiceOrders(nextOrders);
      setRainSimulations((prev) => [...prev, station.nome]);

      const resolved = resolveSimulation(station, nextOrders);
      const simulacao = changed
        ? { ...resolved, dataAnterior: previousDate }
        : resolved;

      addAlert(buildRainAlert(station, simulacao));

      return { station, simulacao, changed, previousDate, newDate };
    },
    [serviceOrders, rainSimulations, addAlert],
  );

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
      rainSimulations,
      simulateRain,
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
      rainSimulations,
      simulateRain,
      showToast,
      toast,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}