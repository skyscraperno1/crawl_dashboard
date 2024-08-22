import { motion } from "framer-motion";
import { fadeIn } from "./fadeIn";
import { TypeAnimation } from "react-type-animation";
import SearchInput from "../homeInput/SearchInput";
import "./content.scss";
const selectItems = ["本地服务", "远程服务"];
function Content({ t, getData }) {
  const sequence = selectItems.flatMap((item) => [item, 2000]);

  return (
    <section className="flex-1 relative pt-60 h-[100vh] text-white px-40">
      <motion.div
        variants={fadeIn("down", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.7 }}
        className="container mx-auto p-4 flex h-full z-10 flex-col items-center"
      >
        <h2 className="text-6xl mb-10 mx-40 header-bg font-textBd font-semibold h-28 text-center">
          {t("main-header")}
        </h2>
        <div className="uppercase font-semibold text-3xl mb-8 mt-20">
          <span className="text-white mr-2">{t("support-currency")}</span>
          <TypeAnimation
            sequence={sequence}
            speed={50}
            className=" text-themeColor"
            wrapper="span"
            repeat={Infinity}
          />
        </div>
        <div className="h-24 w-full px-12">
          <SearchInput
            t={t}
            getData={getData}
            selectItems={selectItems}
          ></SearchInput>
        </div>
      </motion.div>
    </section>
  );
}

export default Content;
