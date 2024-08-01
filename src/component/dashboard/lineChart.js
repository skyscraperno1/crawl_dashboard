export const makeLineChart = (sourceArr) => {
  const chartData = sourceArr.reduce((acc, item) => {
    acc.xAxisData.push(item.today);
    acc.seriesData.push(item.count);
    return acc;
  }, { xAxisData: [], seriesData: [] });
  return {
    title: {
      text: 'Line Chart',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: chartData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: 'Value',
      type: 'line',
      data: chartData.seriesData
    }]
  };
}