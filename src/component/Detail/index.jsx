import { motion } from "framer-motion";
import { useState } from "react";
import { BiLeftIndent, BiRightIndent } from "react-icons/bi";
import SideBar from "./sideBar";
import DetailCanvas from "./detailCanvas";
function Detail({ t, getData }) {
  const [showSide, setShowSide] = useState();
  const toggleShow = () => {
    if (!showSide) return;
    setShowSide(!showSide);
  };
  return (
    <div className="text-text bg-bg w-full h-full pt-20">
      <div className="relative w-full h-full px-7 py-4 flex rounded-md">
        {/* sidebar */}
        <motion.div
          className="rounded-md bg-boardBg overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: showSide ? "625px" : 0 }}
          transition={{ duration: 0.5 }}
        >
          <SideBar />
        </motion.div>
        {/* toggle btn */}
        {showSide ? (
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: showSide ? "633px" : 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer absolute top-14 text-xl h-10 w-6 bg-bg flex items-center justify-center rounded-l-[13px]"
            onClick={toggleShow}
          >
            <BiLeftIndent />
          </motion.div>
        ) : (
          <motion.div
            initial={{ left: "48px" }}
            animate={{ left: !showSide ? "48px" : 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer absolute top-14 text-xl h-10 w-6 bg-boardBg flex items-center justify-center rounded-l-[13px]"
            onClick={toggleShow}
          >
            <BiRightIndent />
          </motion.div>
        )}
        {/* left Main */}
        <div className="flex-1 bg-boardBg rounded-md ml-10">
          <DetailCanvas t={t} getData={getData} />
        </div>
      </div>
    </div>
  );
}

export default Detail;
