import React, { useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import useClickOutside from "../../utils/useClickOutside";
import { FaArrowLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function Button({ children, onClick, disabled, ariaLabel }) {
  return (
    <button
      className="relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef}>
        <div className="h-full w-full text-text">
          <motion.div
            animate={{
              width: isOpen ? "300px" : "52px",
            }}
            initial={false}
          >
            <div className="overflow-hidden p-2">
              {!isOpen ? (
                <Button
                  onClick={() => setIsOpen(true)}
                  ariaLabel="Search notes"
                >
                  <FaSearch className="h-5 w-5" />
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setIsOpen(false)} ariaLabel="Back">
                    <FaArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative w-full">
                    <input
                      className="h-9 w-full rounded-lg border border-zinc-100/10 bg-transparent p-2 placeholder-zinc-500 focus:outline-none"
                      autoFocus
                      placeholder="Search notes"
                    />
                    <div className="absolute right-1 top-0 flex h-full items-center justify-center"></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}

export default SearchIcon;
