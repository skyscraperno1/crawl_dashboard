import { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./HomeSelect.scss";
const HomeSelect = ({ options, onChange, defaultValue, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultValue ? defaultValue : ""
  );
  const selectRef = useRef(null);

  const handleClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };
  const handleSelectOption = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    onChange(value);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={selectRef}
      className="select overflow-hidden overflow-y-hidden w-full px-2 flex items-center text-slate-300 text-base"
    >
      <div
        className={`bg-${selectedOption} bg-contain bg-no-repeat w-6 h-6 mr-2`}
      ></div>
      <div
        className={`${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } flex-1 truncate`}
        onClick={handleClick}
      >
        {selectedOption}
      </div>
      <FiChevronDown />
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={`hide-scrollbar absolute top-[100%] max-h-[305px] overflow-x-hidden text-text z-50 w-[130px] bg-[#191819] rounded-lg -translate-x-2 translate-y-1 py-2`}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={`justify-between hover:bg-[#ffffff20] h-8 leading-8 w-full cursor-pointer ${
                  selectedOption === option.value ? "bg-themeColor" : ""
                }`}
                onClick={() => handleSelectOption(option.value)}
              >
                <div className="mx-4 w-full flex items-center justify-between">
                  <div
                    className={`bg-${option.value} bg-contain bg-no-repeat w-6 h-6`}
                  ></div>
                  <div className="ml-2 truncate flex-1">{option.value}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeSelect;
