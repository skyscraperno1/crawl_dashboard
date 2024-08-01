import { useState } from "react";
import Switcher from "./langSwitch";
import { calValueType } from "../../utils";
import FlyoutLink from "../common/Flyout";
import HeaderMenu from "./headerMenu";
const list = [
  { path: "/", text: "home" },
  { path: [{
    href: "/dashboard",
    name: "看板"
  }, {
    href: "/overallCase",
    name: "详情"
  }], text: "dashboard" },
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

  const handleClick = (path) => {
    if (calValueType(path, "string")) {
      window.location.href = path;
    } 
  };
  return (
    <header
      className={`${
        showBd ? "border-b border-[#303030]" : ""
      } h-[80px] w-full fixed top-0 left-0 right-0 z-20 backdrop-blur-sm px-8`}
    >
      <div className="p-4 flex items-center">
        <div
          className="cursor-pointer w-40 h-12 bg-logoSm xl:bg-logo bg-no-repeat xl:bg-cover bg-contain"
          onClick={() => {
            window.location.href = "/";
          }}
        />
        <div className="container mx-auto">
          <div className="flex items-center justify-center relative">
            {list.map((it) => {
              return (
                <div
                  key={it.path}
                  className={`${
                    activeItem === it.path || activeItem === ""
                      ? ""
                      : "opacity-80"
                  } text-2xl duration-300 font-semibold px-8 cursor-pointer`}
                  onClick={() => {
                    handleClick(it.path);
                  }}
                  onMouseEnter={handleEnter.bind(null, it.path)}
                  onMouseLeave={handleLeave}
                >
                  {calValueType(it.path, "array") ? (
                    <FlyoutLink FlyoutContent={HeaderMenu} menuList={it.path}>
                      {t(it.text)}
                    </FlyoutLink>
                  ) : (
                    t(it.text)
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-40">
          <Switcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
