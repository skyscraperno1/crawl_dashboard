import React, { useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts";
import theme from "../../utils/echartsTheme.json";
import { debounce } from "../../utils";
const Page = ({ options }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  const handleResize = useCallback(debounce(() => {
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  }), []);
  useEffect(() => {
    if (chartInstance) {
      chartInstance?.dispose();
    }
    echarts.registerTheme("custom-dark", theme);
    chartInstance = echarts.init(chartRef.current, 'custom-dark');
    chartInstance.setOption(options);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance?.dispose();
    };
  }, [theme]);
  return (
    <div className="chart-box w-full h-full relative">
      <p className="w-full h-full" ref={chartRef}></p>
    </div>
  );
};
export default Page;
