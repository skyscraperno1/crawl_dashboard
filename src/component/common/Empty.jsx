import img from "../../assets/empty.png";
function Empty({ description, t, size = "middle" }) {
  const desc = description ? description : t("empty");
  const isSmall = size === "small";
  return (
    <div className="flex flex-col h-full w-full items-center justify-center z-[999]">
      <img
        alt=""
        src={img}
        className={`${isSmall ? "h-[75px]" : "h-[150px]"}`}
      />
      <p className="text-text pt-4">{desc}</p>
    </div>
  );
}
export default Empty;
