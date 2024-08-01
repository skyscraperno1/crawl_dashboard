import ScrollTable from "./ScrollTable";
import Charts from "./Charts";
import styled from "styled-components";
import { getOverAllData, getProjectPage } from "../../apis/dashBoardApis";
import { useEffect, useState } from "react";
import { makeLineChart, makePieChart, makePieChart1 } from "./MakeOptions";
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
  const [pieChartOptions1, setPieChart1] = useState(null);
  const [lineChartOptions, setLineChart] = useState(null);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    getOverAllData().then((res) => {
      if (res.code === 200) {
        setPieChart(makePieChart(res.data.A));
        setPieChart1(makePieChart1(res.data.B));
        setLineChart(makeLineChart(res.data.C));
      }
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
    }).then((res) => {
      if (res.code === 200) {
        const newData = res.data.rows.map(it => {
          return {
            name: it.rcoinName + '/' + it.fcoinName,
            liquidity: it.liquidity,
            date: it.today,
            key: it.id
          }
        })
        setTableData(newData)
      }
    })
  }, []);
  return (
    <div className="pt-20 h-full w-full">
      <section
        className="grid grid-cols-6 grid-rows-2 gap-6 w-[80%] p-4 mx-auto"
        style={{ height: "calc(100% - 1rem)" }}
      >
        <Section $isCard={true} className="col-span-2">
          {pieChartOptions1 && <Charts options={pieChartOptions1} />}
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
