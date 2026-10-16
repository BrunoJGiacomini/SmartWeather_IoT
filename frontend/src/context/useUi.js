import { useContext } from "react";
import { UiContext } from "./uiContextObject.js";

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("useUi deve ser usado dentro de <UiProvider>");
  }
  return ctx;
}