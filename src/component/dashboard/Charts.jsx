import React, { useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts";
import { debounce } from "../../utils";
const Page = ({ options }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  const handleResize = debounce(() => {
    if (chartInstance) {
      chartInstance.resize();
    }
  }, 500);
  useEffect(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
    chartInstance = echarts.init(chartRef.current, 'custom-dark');
    chartInstance.setOption(options);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance?.dispose();
    };
  }, []);
  return (
    <div className="chart-box w-full h-full relative">
      <p className="w-full h-full" ref={chartRef}></p>
    </div>
  );
};
export default Page;
