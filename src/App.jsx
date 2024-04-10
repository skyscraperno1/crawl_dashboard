import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";
import Detail from "./component/Detail";


function App() {
  const { t } = useTranslation();
  const go = (pathname) => {
    setCurrentPage(pathname)
    window.location.pathname = pathname;
  }
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  function renderPage() {
    if (currentPage.includes("/detail")) {
      return (
        <>
          <Detail t={t} goBack={go.bind(null, "/")} />
        </>
      );
    } else if (currentPage === "/") {
      return (
        <>
          <Content t={t} getData={(val) => {go('/detail/' + val)}} />
          <BgCanvas index={0} />
          <BgCanvas index={1} />
        </>
      );
    } else {
      return <div className="h-full w-full mx-auto pt-20 text-center text-text bg-black">Empty</div>;
    }
  }
  return (
    <div className="App h-full font-text">
      <Header t={t} />
      {renderPage()}
    </div>
  );
}

export default App;
