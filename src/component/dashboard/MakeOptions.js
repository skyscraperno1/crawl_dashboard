const colors = [
  "#7deff8",
  "#4071d6",
  "#47b8e0",
  "#a5d296",
  "#c4ccd3",
  "#e062ae",
  "#e690d1",
  "#e7bcf3",
  "#7289ab",
  "#91ca8c",
  "#f49f42",
];
const bgColor = "#303135";
export const makeLineChart = (sourceArr) => {
  const chartData = sourceArr.reduce(
    (acc, item) => {
      acc.xAxisData.push(item.today);
      acc.seriesData.push(item.count);
      return acc;
    },
    { xAxisData: [], seriesData: [] }
  );
  return {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: chartData.xAxisData,
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
          lineStyle: {
              color: '#333' // 设置 Y 轴轴线的颜色
          }
      },
      splitLine: {
          lineStyle: {
              color: ['#ccc'] // 设置 Y 轴分隔线的颜色
          }
      },
      axisLabel: {
          color: '#666' // 设置 Y 轴文字颜色
      }
  },
    series: [
      {
        name: "Value",
        type: "line",
        data: chartData.seriesData,
      },
    ],
  };
};

export const makePieChart = (sourceArr, sourceArr1) => {
  let total = 0;
  let pinTotal = 0;
  const title = "关注/总数";

  const chartData = sourceArr.map((it) => {
    total += it.count;
    if (it.is_hold === "1") {
      pinTotal = it.count;
    }
    return {
      name: it.is_hold === "0" ? "未关注" : "关注",
      value: it.count,
    };
  });
  const chartData1 = sourceArr1.map((it) => {
    return {
      name: it.source,
      value: it.count,
    };
  }); 
  const pin = `${pinTotal}/${total}`;
  return {
    backgroundColor: bgColor,
    color: colors,
    title: {
      text: "{a|" + pin + "}\n{c|" + title + "}",
      x: "5%",
      y: "bottom",
      textStyle: {
        rich: {
          a: {
            fontSize: 38,
            color: "#ffffff",
          },
          b: {
            fontSize: 38,
            color: "#ffffff",
          },
          c: {
            fontSize: 30,
            color: "#ffffff",
            padding: [10, 0, 0, 0],
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "60%"],
        center: ["50%", "50%"],
        data: chartData,
        startAngle: 225,  
      },
      {
        type: "pie",
        radius: ["45%", "50%"],
        center: ["50%", "50%"],
        data: chartData1
      }
    ],
  };
};

export const MakeChartFactory = (type) => {
  const chartFactories = {
    line: makeLineChart,
    pie: makePieChart,
  };

  const chartFactory = chartFactories[type];
  if (!chartFactory) {
    throw new Error(`Unknown chart type: ${type}`);
  }

  return (sourceArr) => chartFactory(sourceArr);
};
