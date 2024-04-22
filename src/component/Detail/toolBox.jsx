import { Button } from "antd";
import SearchInput from "../homeInput/SearchInput";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";

function ToolBox({ t, showMore, loadMore, getData }) {
  const [showInput, setShowInput] = useState(false);

  const hideClick = () => {
    setShowInput(false);
  };

  return (
    <div className="absolute py-2 px-4 w-full h-20 z-50 flex items-center justify-between ">
      <motion.div
        initial={{ width: 0, overflow: "hidden" }}
        animate={{
          width: showInput ? "980px" : 0,
          overflow: showInput ? "unset" : "hidden",
        }}
        transition={{
          width: { duration: 0.3 },
          overflow: { duration: 0.5 },
        }}
        className="h-full"
      >
        <SearchInput
          t={t}
          getData={(val, type) => {
            getData(val, type);
          }}
          selectItems={["Bep20", "BNB"]}
          menuClick={hideClick.bind(null)}
        ></SearchInput>
      </motion.div>
      <div className="flex items-center justify-between">
        <IoSearch
          onClick={() => {
            setShowInput(!showInput);
          }}
          className="cursor-pointer mr-4 text-lg"
        />
        <Button
          onClick={loadMore.bind(null)}
          className={`${showMore ? "inline-block" : "hidden"} h-10`}
          type="primary"
        >
          {t("more")}
        </Button>
      </div>
    </div>
  );
}

export default ToolBox;
