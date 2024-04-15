import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";
import Detail from "./component/Detail";
import Table from './component//table/tableIndex'

function App() {
  const { t } = useTranslation();
  const go = (pathname) => {
    setCurrentPage(pathname)
    window.location.pathname = pathname;
  }
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  const showBd = useMemo(() => {
    if (currentPage === '/') {
      return false;
    } else {
      return true;
    }
  }, [currentPage])

  function renderPage() {
    if (currentPage.includes("/detail")) {
      return (
        <>
          <Detail t={t} />
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
    } else if (currentPage === '/table') {
      return <Table />
    } else {
      return <div className="h-full w-full mx-auto pt-20 text-center text-text bg-bg">Empty</div>;
    }
  }
  return (
    <div className="App h-full font-text">
      <Header t={t} showBd={showBd}/>
      {renderPage()}
    </div>
  );
}

export default App;
