import { AiFillCloseCircle } from "react-icons/ai";

const InputHistory = ({ list }) => {
  const handleClick = () => {
    console.log('click')
  }
  return (
    <div className="rounded-md hide-scrollbar absolute bottom-9 w-[150px] bg-[#191819] py-2">
      {list.map((it, idx) => (
        <div
          className="flex items-center justify-between truncate hover:bg-[#ffffff20] h-8 w-full cursor-pointer py-2 text-base leading-4 px-4"
          key={idx}
        >
          <div className="flex-1 truncate">{it.value}</div>
          <AiFillCloseCircle className="text-slate-400" onClick={handleClick}/>
        </div>
      ))}
    </div>
  );
};

export default InputHistory;
