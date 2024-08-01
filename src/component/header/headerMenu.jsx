const HeaderMenu = ({ menuList }) => {
  return (
    <div className="w-16 bg-boardBg py-4 px-2 text-center shadow-xl rounded-lg">
      {menuList.map((it) => {
        return (
          <div
            key={it.href}
            onClick={() => {
              window.location.href = it.href;
            }}
            className="cursor-pointer text-sm hover:underline text-text"
          >
            {it.name}
          </div>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
