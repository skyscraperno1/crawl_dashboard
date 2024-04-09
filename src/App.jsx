import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "./translation/i8n";
import Header from "./component/header/header";
import Content from "./component/content/content";
import BgCanvas from "./component/BgCanvas";

export const DataContext = createContext();
function App() {
  const [data, setData] = useState(null);
  const { t } = useTranslation();
  const getData = (val) => {
    setData(val);
  };
  return (
    <div className="App h-full">
      <DataContext.Provider value={data}>
        <Header t={t} />
        <Content t={t} getData={getData} />
        <BgCanvas index={0} />
        <BgCanvas index={1} />
      </DataContext.Provider>
    </div>
  );
}

export default App;
