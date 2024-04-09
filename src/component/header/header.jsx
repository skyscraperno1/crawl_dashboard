import Switcher from "./langSwitch";
function Header() {
  const handleClick = () => {
    window.location.href = '/'
  };
  return (
    <header className="h-[80px] w-full fixed top-0 left-0 right-0 z-20 backdrop-blur-sm px-8">
      <div className="p-4 flex items-center">
        <div
          className="cursor-pointer w-40 h-12 mx-8 bg-logo bg-no-repeat bg-cover"
          onClick={handleClick}
        />
        <div className="container mx-auto flex items-center">
        </div>
        <Switcher />
      </div>
    </header>
  );
}

export default Header;
