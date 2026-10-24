import App from "../App.jsx";
import Modal from "./Modal.jsx";
import Toast from "./Toast.jsx";

function RootLayout() {
  return (
    <>
      <App />
      <Modal />
      <Toast />
    </>
  );
}

export default RootLayout;