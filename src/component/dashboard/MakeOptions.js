const colors = [
  "#ef4444",
  "#4ade80",
  "#a78bfa",
  "#a5d296",
  "#c4ccd3",
  "#e062ae",
  "#e690d1",
  "#e7bcf3",
  "#7289ab",
  "#91ca8c",
  "#f49f42",
];


const getMinNum = (arr) => {
  const min = Math.min(...arr.map((obj) => obj.count));
  const max = Math.max(...arr.map((obj) => obj.count));
  if (max - min > min - 0) {
    return 0
  } else {
    return min
  }
}
export const makeLineChart = (sourceArr) => {
  const chartData = sourceArr.reduce(
    (acc, item) => {
      acc.xAxisData.push(item.today);
      acc.seriesData.push(item.count);
      return acc;
    },
    { xAxisData: [], seriesData: [] }
  );
  const min = getMinNum(sourceArr)
  return {
    tooltip: {
      trigger: "axis",
      formatter: function(params) {
        const [val] = params
        return `${val.name}<br />${val.marker} 数量: <b>${val.value}</b>`
      }
    },
    backgroundColor: 'transparent',
    grid: {
      left: '60px', 
      right: '40px', 
      top: '14%', 
      bottom: '30px' 
    },
    xAxis: {
      type: "category",
      data: chartData.xAxisData,
      axisLabel: {
        color: "#333",
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
              color: ['#666'] // 设置 Y 轴分隔线的颜色
          }
      },
      axisLabel: {
          color: '#999' // 设置 Y 轴文字颜色
      },
      lineStyle: {
        color: '#FF0000'
      },
      min
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

const ave = '#286dff'
const tg = 'rgba(51, 144, 236, 0.8)'
const wx = '#07c160'
const qq = '#f43f5e'
function calculatePercentages(data) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const percentages = data.map(item => {
      const percentage = (item.count / total * 100).toFixed(2); // 保留两位小数
      return {
          name: item.source,
          value: percentage,
      };
  });
  return percentages;
}
export const makePieChart = (sourceArr, sourceArr1) => {
  let total = 0;
  let pinTotal = 0;
  const title = "关注/总项目";

  sourceArr.map((it) => {
    total += it.count;
    if (it.is_hold === "1") {
      pinTotal = it.count;
    }
  });
  const chartData = calculatePercentages(sourceArr1)
  const pin = `${pinTotal}/${total}`;
  return {
    color: [ave, qq, tg, wx],
    tooltip: {
      trigger: 'item', // 触发类型，item 表示数据项触发
      backgroundColor: '#fff', // 背景颜色
      borderColor: '#333', // 边框颜色
      borderWidth: 1, // 边框宽度
      borderRadius: 5, // 边框圆角
      padding: [10, 10], // 内边距
      textStyle: {
        color: '#666', // 字体颜色
        fontSize: 14, // 字体大小
      },
      formatter: (params) => {
        return `${params.name}<br />${params.marker} 占比: <b>${params.value}%</b>`
      }
    },
    title: {
      text: "{a|" + pin + "}\n{c|" + title + "}",
      x: "center",
      y: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 20,
            color: "#ffffff",
          },
          b: {
            fontSize: 20,
            color: "#ffffff",
          },
          c: {
            fontSize: 16,
            color: "#ffffff",
            fontStyle: 'italic',
            padding: [10, 0, 0, 0],
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "65%"],
        center: ["50%", "50%"],
        data: chartData
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
