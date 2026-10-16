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

export function UiProvider({ children }) {
  const [drawerContent, setDrawerContent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [serviceOrders, setServiceOrders] = useState(SERVICE_ORDERS);
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const toastTimerRef = useRef(null);

  const openDrawer = useCallback((node) => {
    setDrawerContent(node);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setDrawerContent(null);
  }, []);

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

  const selectedSector = useMemo(() => {
    if (!selectedSectorId) return null;
    return SECTORS[selectedSectorId] || null;
  }, [selectedSectorId]);

  const value = useMemo(
    () => ({
      isDrawerOpen,
      drawerContent,
      openDrawer,
      closeDrawer,
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
      showToast,
      toast,
    }),
    [
      isDrawerOpen,
      drawerContent,
      openDrawer,
      closeDrawer,
      isModalOpen,
      modalContent,
      openModal,
      closeModal,
      selectedSectorId,
      selectedSector,
      serviceOrders,
      equipment,
      showToast,
      toast,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}