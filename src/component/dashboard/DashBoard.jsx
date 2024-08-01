import ScrollTable from "./ScrollTable";
import Charts from "./Charts";
import styled from "styled-components";
import { getOverAllData } from "../../apis/dashBoardApis";
import { data } from './data'
import { useEffect, useState } from "react";
import { makeLineChart, makePieChart } from "./MakeOptions";
const columns = [
  { title: "姓名", key: "name" },
  { title: "Age", key: "age" },
  { title: "Address", key: "address" },
];
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
    font-size: ${(props) => (props.$titleSize - 16) + 'px'};
    height: ${(props) => props.$titleSize + 'px'};
    line-height: ${(props) => props.$titleSize + 'px'};
  }
  & > .inner-section {
    height: calc(100% - ${(props) => props.$titleSize + 'px'});
  }
`;
const DashBoard = ({ t }) => {
  const [pieLoading, setPieLoading] = useState(false);
  const [pieChartOptions, setPieChart] = useState(null);
  const [lineChartOptions, setLineChart] = useState(null);
  useEffect(() => {
    setPieLoading(true);
    // 模拟Ajax获取数据
    setTimeout(() => {
      setPieChart(
        makePieChart([
          { is_hold: "1", count: 1 },
          { is_hold: "0", count: 476 },
        ])
      );
      setLineChart(
        makeLineChart([
          { today: "2023-04-01", count: 1 },
          { today: "2023-04-02", count: 2 },
          { today: "2023-04-03", count: 3 },
        ])
      );
    }, 1000);
    // getOverAllData().then((res) => {
    //   if (res.code === 200) {
    //     setPieChart(makePieChart(res.data.A))
    //     setLineChart(makeLineChart(res.data.C))
    //   }
    // }).finally(() => {
    //   setPieLoading(false)
    // })
  }, []);
  return (
    <div className="pt-20 h-full w-full">
      <section
        className="grid grid-cols-6 grid-rows-2 gap-4 w-full p-4"
        style={{ height: "calc(100% - 1rem)" }}
      >
        {/* PieChart */}
        <Section $isCard={false} $titleSize="50" className="col-span-2">
          <h1>
            {t("pie-title")}
          </h1>
          <Section $isCard={true} className="inner-section">
            {pieChartOptions && <Charts options={pieChartOptions} />}
          </Section>
        </Section>
        <Section $isCard={false} className="col-span-4">
          {/* LineChart */}
          {lineChartOptions && <Charts options={lineChartOptions} />}
        </Section>
        <Section $isCard={true} className="col-span-2"></Section>
        <Section $isCard={false} className="col-span-4">
          <ScrollTable columns={columns} dataSource={data} t={t}/>
        </Section>
      </section>
    </div>
  );
};

export default DashBoard;
