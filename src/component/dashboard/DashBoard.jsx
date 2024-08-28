import ScrollTable from "./ScrollTable";
import Charts from "./Charts";
import styled from "styled-components";
import { getOverAllData, getProjectPage } from "../../apis/dashBoardApis";
import { useEffect, useState } from "react";
import { makeLineChart, makePieChart } from "./MakeOptions";
import Card from './Card'
import { FaAngleDoubleUp, FaAngleDoubleDown, FaEquals  } from "react-icons/fa";
const Section = styled.div`
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: ${({ $height }) => $height || "100%"};
  width: ${({ $width }) => $width || "100%"};
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
const DashBoard = ({ t, messageApi }) => {
  const columns = [
    { title: t('pair'), key: "name", width: '160px' },
    { title: t('token'), key: "token" },
    { title: t('liquidity'), key: "liquidity", width: '100px' },
    { title: t('date'), key: "date", width: '100px' },
  ];
  const [pieChartOptions, setPieChart] = useState(null);
  const [lineChartOptions, setLineChart] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [info, setInfo] = useState([
    { name: "下降数量", key: "downCount", val: 0, Icon: FaAngleDoubleDown },
    { name: "相等数量", key: "eqCount", val: 0, Icon: FaEquals },
    { name: "增长数量", key: "upCount", val: 0, Icon: FaAngleDoubleUp },
  ])
  
  const [dateData, setDateData] = useState({
    startDate: '',
    endDate: '',
    average: 0
  })
  const getDateData = (dataArr) => {
    const len = dataArr.length;
    const startDate = dataArr[0].today
    const endDate = dataArr[len - 1].today
    const average = dataArr.reduce((acc, cur) => acc + cur.count, 0) / len;
    setDateData({
      startDate,
      endDate,
      average
    })
    console.log(startDate, endDate, average);
  }
  useEffect(() => {
    getOverAllData().then((data) => {
      setPieChart(makePieChart(data.A, data.B));
      setLineChart(makeLineChart(data.C.reverse()));
      getDateData(data.C)
      const [_info] = data.D;
      setInfo([
        { name: "下降数量", key: "downCount", val: _info.downCount, Icon: FaAngleDoubleDown  },
        { name: "相等数量", key: "eqCount", val: _info.eqCount, Icon: FaEquals },
        { name: "增长数量", key: "upCount", val: _info.upCount, Icon: FaAngleDoubleUp },
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
        let name
        if (it.rcoinName && it.fcoinName) {
          name = it.rcoinName + '/' + it.fcoinName
        } else if (it.rcoinName && it.fcoinName) {
          name = it.rcoinName
        } else if (it.fcoinName) {
          name = it.fcoinName
        } else {
          name = ''
        }
        return {
          name,
          liquidity: it.liquidity,
          token: it.token,
          date: it.today,
          key: it.id,
          net: it.net
        }
      })
      setTableData(newData)
    })
  }, []);
  return (
    <div className="pt-20 h-full w-full">
      <section
        className="grid grid-cols-6 grid-rows-5 gap-6 w-[80%] p-4 mx-auto"
        style={{ height: "calc(100% - 1rem)" }}
      >
        <Section $isCard={false}  $titleSize="46" className="col-span-6 row-span-2 bg-[#303135f3] rounded">
          <div className="flex flex-col w-full h-full">
            <div className="px-12 py-2 border-[#545860] border-solid" style={{ borderBottomWidth: '1px'}}>
              <p className="text-2xl mb-1">
                {t('dashboard.lineTitle')}
              <span className="text-xs text-stone-500">{t('dashboard.lineExplain')}</span>
              </p>
            </div>
            <div className="flex-1 flex">
              <div className="flex flex-col gap-2 w-[15%]">
                <div className="w-full h-full p-4 px-8 flex flex-col justify-center border-r-[1px] border-[#545860] ">
                {
                  dateData.endDate && (
                    <>
                      {
                        Object.keys(dateData).map((key) => {
                          return (
                            <div className="flex-1 truncate" key={key}> 
                              <div className="text-xs text-stone-500">{t(key)}</div>
                              <div className="text-xl leading-loose">{dateData[key]}</div>
                            </div>
                          )
                        })
                      }
                    </>
                  )
                }
                </div>
              </div>
              <div className="flex-1">
                {lineChartOptions && <Charts options={lineChartOptions} />}
              </div>
            </div>
          </div>
        </Section>
        {info.map((it) => {
          return (
            <Section className={`col-span-2 row-span-1 w-72 flex flex-col justify-center items-center py-8 sm:py-0 text-text rounded`} key={it.key}>
              <Card title={it.val} subtitle={it.name} Icon={it.Icon} type={it.key}/>
            </Section>
          )
        })}
        {/* PieChart */}
        <Section $isCard={false} $titleSize="10" className="col-span-2 row-span-2 bg-[#303135f3] rounded">
          {pieChartOptions && <Charts options={pieChartOptions} />}
        </Section>
        {/* ScrollTable */}
        <Section $isCard={false} $titleSize="46" className="col-span-4 row-span-2 bg-[#303135] rounded">
            <ScrollTable messageApi={messageApi} columns={columns} dataSource={tableData} t={t} />
        </Section>
      </section>
    </div>
  );
};

export default DashBoard;
