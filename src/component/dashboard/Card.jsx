import { useMemo } from "react";
import CountUp from "react-countup";
const Card = ({ title, subtitle, Icon, type }) => {
  const color = useMemo(() => {
    if (type === 'downCount') {
      return 'red'
    } else if (type === 'eqCount') {
      return 'violet'
    } else {
      return 'lime'
    }
  }, [type])
  const possibles = [
    'text-violet-600',
    'text-violet-400',
    'text-violet-200',
    'text-violet-800',
    'group-hover:text-violet-400',
    'group-hover:text-red-400',
    'group-hover:text-lime-400',
    'group-hover:text-violet-200',
    'group-hover:text-red-200',
    'group-hover:text-lime-200',
    'text-red-600',
    'text-red-400',
    'text-red-200',
    'text-red-800',
    'from-red-600',
    'to-red-800',
    'text-lime-600',
    'text-lime-400',
    'text-lime-200',
    'text-lime-800',
    'from-lime-600',
    'to-lime-800',
  ]
  return (
    <div
      className="w-full h-full p-4 rounded relative overflow-hidden group bg-[#303135f3]"
    >

      <Icon className={`absolute z-10 -top-12 -right-12 text-9xl text-text  group-hover:rotate-12 transition-transform duration-300 group-hover:text-${color}-400`} />
      <Icon className={`mb-2 ml-1 text-normal text-${color}-600 transition-colors relative z-10 duration-300`} />
      <h3 className="font-medium text-4xl text-slate-950 group-hover:ml-1 relative z-10 duration-300">
        <CountUp start={0} end={title} duration={0.8} />
      </h3>
      <p className={`text-text group-hover:text-${color}-200 relative z-10 duration-300 text-sm mt-1 ml-1`}>
        {subtitle}
      </p>
    </div>
  );
};

export default Card;