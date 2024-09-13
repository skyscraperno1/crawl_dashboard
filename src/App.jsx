import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";
import Detail from "./component/Detail";
import MyTable from "./component//table/tableIndex";
import DashBoard from "./component/dashboard/DashBoard";
import OverAllCase from "./component/OverAllCase/OverAllCase";
import AssetCollection from "./component/AssetCollection/AssetCollection";
import OverallDetail from "./component/overallDetail";
import { ConfigProvider, theme, message } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";

function EmptyPage() {
  return (
    <div className="h-full w-full mx-auto pt-20 text-center bg-bg">
      Empty
    </div>
  );
}
function App() {
  const { t, i18n } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const currentLang = useMemo(() => {
    if (i18n.language === "zh") {
      return zhCN;
    } else {
      return enUS;
    }
  }, [t]);

  return (
    <div className="App h-full font-text text-text">
      <BrowserRouter>
        {contextHolder}
        <ConfigProvider
          locale={currentLang}
          theme={{
            algorithm: theme.darkAlgorithm,
            token: { colorPrimary: "#bd7c40" },
          }}
        >
          <Header t={t} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Content t={t} />
                  <BgCanvas index={0} />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <DashBoard t={t} messageApi={messageApi} />
                  <BgCanvas index={0} />
                </>
              }
            />
            <Route
              path="/overallCase"
              element={<OverAllCase t={t} messageApi={messageApi} />}
            />
            <Route
              path="/assetCollection"
              element={<AssetCollection t={t} messageApi={messageApi} />}
            />
            <Route
              path="/overallDetail/:type/:id"
              element={   <>
                <OverallDetail messageApi={messageApi} />
                 <BgCanvas index={0} />
               </>}
            />
            <Route path="*" element={<EmptyPage />}></Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
