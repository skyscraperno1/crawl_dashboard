import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";
import Detail from "./component/Detail";
import MyTable from "./component//table/tableIndex";
import DashBoard from "./component/dashboard/DashBoard";
import OverAllCase from "./component/OverAllCase/OverAllCase";
import AssetCollection from "./component/AssetCollection/AssetCollection"
import OverallDetail from "./component/overallDetail";
import { ConfigProvider, theme, message } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from 'antd/lib/locale/en_US'; 
function App() {
  const { t, i18n } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const currentLang = useMemo(() => {
    if (i18n.language === 'zh') {
      return zhCN;
    } else {
      return enUS;
    }
  }, [t])
  const go = (pathname) => {
    setCurrentPage(pathname);
    window.location.pathname = pathname;
  };
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  const showBd = useMemo(() => {
    if (currentPage === "/") {
      return false;
    } else {
      return true;
    }
  }, [currentPage]);

  function renderPage(messageApi) {
    if (currentPage.includes("/detail")) {
      return (
        <>
          <Detail
            t={t}
            getData={(val, type) => {
              go("/detail/" + type + "/" + val.toLowerCase());
            }}
          />
        </>
      );
    } else if (currentPage === "/") {
      return (
        <>
          <Content
            t={t}
            getData={(val, type) => {
              go("/detail/" + type + "/" + val.toLowerCase());
            }}
          />
          <BgCanvas index={0} />
        </>
      );
    } else if (currentPage === "/table") {
      return <MyTable t={t} />;
    } else if (currentPage === "/dashboard") {
      return (
        <>
          <DashBoard t={t} messageApi={messageApi}/>
          <BgCanvas index={0} />
        </>
      );
    } else if (currentPage === "/overallCase") {
      return (
        <>
          <OverAllCase t={t} messageApi={messageApi}/>
        </>
      );
    } else if (currentPage === '/assetCollection') {
      return (
        <>
          <AssetCollection t={t} messageApi={messageApi}/>
        </>
      )
    } else if (currentPage.includes('/overallDetail')) {
      return (
        <>
          <OverallDetail messageApi={messageApi}/>
        </>
      )
    } else {
      return (
        <div className="h-full w-full mx-auto pt-20 text-center bg-bg">
          Empty
        </div>
      );
    }
  }
  return (
    <div className="App h-full font-text text-text">
      {contextHolder}
      <ConfigProvider
        locale={currentLang}
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorPrimary: "#bd7c40" },
        }}
      >
        <Header t={t} showBd={showBd} />
        {renderPage(messageApi)}
      </ConfigProvider>
    </div>
  );
}

export default App;
