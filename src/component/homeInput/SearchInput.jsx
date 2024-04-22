import { useState, useRef } from "react";
import "./SearchInput.scss";
import { CgMenu } from "react-icons/cg";
import { AiFillCloseCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import HomeSelect from "./HomeSelect";
import InputHistory from "./History";
import { useEffect } from "react";

function SearchInput({ t, getData, selectItems, menuClick = null}) {
  const [iptValue, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(selectItems[0]);
  const [isFocused, setIsFocused] = useState(false);
  const [historyList, setHistory] = useState(
    JSON.parse(localStorage.getItem("search_option") || "[]")
  );
  const [showHistory, setShowHistory] = useState(false);

  const selectChange = (val) => {
    setType(val);
    setValue('')
  };
  const handleChange = (e) => {
    const text = e.target.value;
    setValue(text);
    setVisible(!!text);
  };
  const handleFork = () => {
    setValue("");
    setVisible(false);
  };
  const selectRef = useRef(null);
  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setShowHistory(false);
    }
  };
  useEffect(() => {
    if (showHistory) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showHistory]);

  const handleDel = (val) => {
    const newList = historyList.filter((it) => it.value !== val);
    setHistory(newList);
    localStorage.setItem("search_option", JSON.stringify(newList));
    if (!newList.length) {
      setShowHistory(false)
    }
    setValue('')
  };

  const handleChoose = (val, type) => {
    setValue(val)
    setType(type)
    setVisible(true)
    selectRef.current.focus()
  }

  const handleKeyUp = (e) => {
    if (!iptValue) return;
    if (showHistory) {
      setShowHistory(false);
    }
    if (e.key === "Enter") {
      getData(iptValue, type)
      const hasItem = historyList.some((it) => (it.value === iptValue && it.chain === type));
      if (hasItem) return;
      const newHistory = [
        ...historyList,
        {
          value: iptValue,
          chain: type,
        },
      ];
      setHistory(newHistory);
      localStorage.setItem("search_option", JSON.stringify(newHistory));
    }
  };
  return (
    <div
      className={`${
        isFocused ? "border-borderGold" : ""
      } flex relative  h-full max-h-20 backdrop-blur-sm items-center border-2 border-border rounded-full hover:border-borderGold shadow-hoverShadow font-text`}
      id="main-input"
    >
      <div className="pl-4 pr-2 w-44">
        <HomeSelect
          options={selectItems.map((it) => ({ label: it, value: it }))}
          onChange={selectChange}
          disabled={false}
          selValue={type}
        />
      </div>
      <div className="line w-[1px] h-[70%] bg-border"></div>
      <div className="flex items-center w-full h-full px-4 relative">
        <input
          ref={selectRef}
          value={iptValue}
          className="flex-1 h-full bg-transparent text-white text-base"
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder={t("input-placer")}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onClick={() => {
            if (historyList.length) {
              setShowHistory(true);
            }
          }}
        />
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputHistory list={historyList} handleDel={handleDel} handleChoose={handleChoose}/>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {visible && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AiFillCloseCircle
                className="w-4 h-4 cursor-pointer mx-2 text-slate-400"
                onClick={handleFork}
              />
            </motion.div>
          )}
          <CgMenu className={`${menuClick ? 'cursor-pointer' : 'cursor-normal'} text-slate-300 text-2xl`} onClick={menuClick}/>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SearchInput;
