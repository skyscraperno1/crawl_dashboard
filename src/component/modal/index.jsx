import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
const Modal = (props) => {
  const { slot, closeTime = 20000, show = false, onClose = () => {} } = props;

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   let timer = setTimeout(() => {
  //     setShow(false)
  //   }, closeTime)
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //     clearTimeout(timer);
  //     timer = null;
  //   };
  // }, []);

  useEffect(() => {
    console.log("effect");
    if (show) {
      let timer = setTimeout(() => {
        onClose();
      }, closeTime);
      return () => {
        clearTimeout(timer);
        timer = null;
      };
    }
  }, [show, onClose, closeTime]);
  return ReactDOM.createPortal(
    <div className="fixed w-full h-full top-0 left-0 bg-slate-600/40 z-50">
      <AnimatePresence initial={false}>
        {show && <motion.div>{slot}</motion.div>}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default Modal;
