import React, { useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import useClickOutside from "../../utils/useClickOutside";
import { FaArrowLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function Button({ children, onClick, disabled, ariaLabel }) {
  return (
    <button
      className="relative flex h-8 w-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded text-zinc-500 transition-colors hover:bg-themeColor hover:text-text focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function SearchIcon({ onSearch }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const [inputValue, setInputValue] = useState(""); 

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      onSearch(inputValue);
    }
  };

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef}>
        <div className="h-full w-full text-text">
          <motion.div
            animate={{
              width: isOpen ? "400px" : "36px",
            }}
            initial={false}
          >
            <div className="overflow-hidden">
              {!isOpen ? (
                <Button onClick={() => setIsOpen(true)} ariaLabel={t('G6.search')}>
                  <FaSearch className="text-sm" />
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => {
                    setIsOpen(false);
                    setInputValue("");
                  }} ariaLabel="Back">
                    <FaArrowLeft className="text-sm" />
                  </Button>
                  <div className="relative w-full bg-[#1c1c1e] rounded">
                    <input
                      className="h-8 w-full rounded border border-zinc-100/10 bg-transparent p-2 placeholder-zinc-500 focus:outline-none text-xs"
                      autoFocus
                      placeholder={t('G6.search')}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)} // 更新 input 的值
                      onKeyDown={handleKeyDown} 
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
