import { useState } from "react";
import Switcher from "./langSwitch";

const list = [
  { path: "/", text: "home" },
  { path: "/detail", text: "detail" },
  { path: "/table", text: "table" },
];

function Header({ t, showBd }) {
  const [activeItem, setActive] = useState("");
  const handleEnter = (path) => {
    setActive(path);
  };

  const handleLeave = () => {
    setActive("");
  };

  return (
    <header className={`${showBd ? 'border-b border-[#303030]' : ''} h-[80px] w-full fixed top-0 left-0 right-0 z-20 backdrop-blur-sm px-8 text-text`}>
      <div className="p-4 flex items-center">
        <div
          className="cursor-pointer w-40 h-12 mx-8 bg-logo bg-no-repeat bg-cover"
          onClick={() => {
            window.location.href = "/";
          }}
        />
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            {list.map((it) => {
              return (
                <a
                  key={it.path}
                  className={`${
                    activeItem === it.path || activeItem === ""
                      ? ""
                      : "opacity-80"
                  } text-2xl duration-300 font-semibold px-8`}
                  href={it.path}
                  onMouseEnter={handleEnter.bind(null, it.path)}
                  onMouseLeave={handleLeave}
                >
                  {t(it.text)}
                </a>
              );
            })}
          </div>
        </div>
        <div className="w-56">
        <Switcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
