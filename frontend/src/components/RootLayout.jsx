import App from "../App.jsx";
import Drawer from "./Drawer.jsx";
import Modal from "./Modal.jsx";
import Toast from "./Toast.jsx";

function RootLayout() {
  return (
    <>
      <App />
      <Drawer />
      <Modal />
      <Toast />
    </>
  );
}

export default RootLayout;