import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const root = document.getElementById("portal-root");
  return root ? createPortal(children, root) : null;
};

export default Portal;
