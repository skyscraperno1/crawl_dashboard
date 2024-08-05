import ScrollTable from "./ScrollTable";
import Charts from "./Charts";
import styled from "styled-components";
import { getOverAllData, getProjectPage } from "../../apis/dashBoardApis";
import { useEffect, useState } from "react";
import { makeLineChart, makePieChart } from "./MakeOptions";
import CountUp from "react-countup";
import FlipLink from "../common/FlipLink";
const Section = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: ${({ $height }) => $height || "100%"};
  width: ${({ $width }) => $width || "100%"};
  background-color: ${(props) => (!props.$isCard ? "transparent" : "#303135")};
  transition: all 0.3s ease;
  padding: ${(props) => (props.$isCard ? "0.5rem" : "0")};
  position: relative;
  & > h1 {
    font-size: ${(props) => props.$titleSize - 16 + "px"};
    height: ${(props) => props.$titleSize + "px"};
    line-height: ${(props) => props.$titleSize + "px"};
    font-weight: 600;
    margin-bottom: 0.5rem;
    user-select: none;
    font-family: "微软雅黑, Arial, sans-serif";
  }
  & > .inner-section {
    height: calc(100% - ${(props) => props.$titleSize + "px"});
  }
`;
const DashBoard = ({ t }) => {
  const columns = [
    { title: t('pair'), key: "name" },
    { title: t('liquidity'), key: "liquidity" },
    { title: t('date'), key: "date" },
  ];
  const [pieChartOptions, setPieChart] = useState(null);
  const [lineChartOptions, setLineChart] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [info, setInfo] = useState([
    {name: "下降数量", key: "downCount", val: 0},
    {name: "相等数量", key: "eqCount", val: 0},
    {name: "增长数量", key: "upCount", val: 0},
  ])
  useEffect(() => {
    getOverAllData().then((data) => {
      setPieChart(makePieChart(data.A, data.B));
      setLineChart(makeLineChart(data.C));
      const [_info] = data.D;
      setInfo([
        {name: "下降数量", key: "downCount", val: _info.downCount},
        {name: "相等数量", key: "eqCount", val: _info.eqCount},
        {name: "增长数量", key: "upCount", val: _info.upCount},
      ]);
    });
    getProjectPage({
      pageNum: 0,
      pageSize: 0,
      isHold: "1",
      name: "",
      net: "",
      pair: "",
      source: "",
      token: ""
    }).then((data) => {
        const newData = data.rows.map(it => {
          return {
            name: it.rcoinName + '/' + it.fcoinName,
            liquidity: it.liquidity,
            date: it.today,
            key: it.id
          }
        })
        setTableData(newData)
    })
  }, []);
  return (
    <div className="pt-20 h-full w-full">
      <section
        className="grid grid-cols-6 grid-rows-2 gap-6 w-[80%] p-4 mx-auto"
        style={{ height: "calc(100% - 1rem)" }}
      >
        <Section $isCard={true} className="col-span-2 flex flex-col">
          <ul className="mx-auto flex items-center justify-center w-full flex-1">
            {info.map((it, idx) => {
              return (
                <>
                  {idx !== 0 && <p className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]"></p>}
                  <li key={it.key} className="flex w-72 flex-col items-center py-8 sm:py-0 text-text">
                    <CountUp start={0} end={it.val} duration={0.8} className="mb-2 text-center text-7xl font-semibold sm:text-6xl"/>
                    <FlipLink>{it.name}</FlipLink>
                  </li>
                </>
              )
            })}
          </ul>
        </Section>
        
        <Section $isCard={false} $titleSize="46" className="col-span-4">
          {/* LineChart */}
          <h1>{t("line-chart")}</h1>
          <Section className="inner-section">
            {lineChartOptions && <Charts options={lineChartOptions} />}
          </Section>
        </Section>
        {/* PieChart */}
        <Section $isCard={false} $titleSize="10" className="col-span-2">
          <h1></h1>
          <Section $isCard={true} className="inner-section">
            {pieChartOptions && <Charts options={pieChartOptions} />}
          </Section>
        </Section>
        <Section $isCard={false} $titleSize="46" className="col-span-4">
          <h1>{t("pie-title")}</h1>
          <Section $isCard={false} className="inner-section">
            <ScrollTable columns={columns} dataSource={tableData} t={t} />
          </Section>
        </Section>
      </section>
    </div>
  );
};

export default DashBoard;
