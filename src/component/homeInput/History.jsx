import { useCallback } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
const InputHistory = ({ list = [], handleDel = () => {}, handleChoose = () => {}}) => {
  const handleClick = useCallback((e, val) => {
    e.stopPropagation()
    handleDel(val)
  }, [handleDel])

  const chooseClick = useCallback((val) => {
    handleChoose(val)
  }, [handleChoose])
  return (
    <div className="absolute left-2 top-[100%] translate-y-1 rounded-md hide-scrollbar w-[95%] bg-[#191819] py-2">
      {list.map((it) => (
        <div
          className="flex items-center justify-between truncate hover:bg-[#ffffff20] h-10 w-full cursor-pointer py-2 text-base leading-4 px-4"
          key={it.value}
          onClick={chooseClick.bind(null, it.value)}
        >
          <div className="flex-1 truncate">{it.value}</div>
          <AiFillCloseCircle className="text-slate-400" onClick={(e) => {handleClick(e, it.value)}}/>
        </div>
      ))}
    </div>
  );
};

export default InputHistory;
