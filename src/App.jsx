import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";
import DashBoard from "./component/dashboard/DashBoard";
import OverAllCase from "./component/OverAllCase/OverAllCase";
import AssetCollection from "./component/AssetCollection/AssetCollection";
import OverallDetail from "./component/overallDetail";
import OverallG6 from "./component/overallDetail/overallG6/OverallG6";
import { ConfigProvider, theme, message } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";

function FullPageG6(messageApi) {
  const [token, setToken] = useState("0x55d398326f99059ff775485246999027b3197955")
  return (
    <>
     <Route path="/track/:type/:add" element={<OverallG6 messageApi={messageApi} token={token} setToken={(token) => setToken(token)}/>}/>
    </>
  )
}
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
            {FullPageG6(messageApi)}
            <Route path="*" element={<EmptyPage />}></Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
