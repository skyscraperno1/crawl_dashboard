import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { getType } from "../../utils";
import Empty from "../common/Empty";
import Spin from "../common/Spin";
const scrollAnimation = keyframes`
  to {
    transform: translateY(-50%);
  }
`;

const scrollBarAnimation = keyframes`
  from {
    width: 0%;
  } to {
    width: 100%;
  }
`;
const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #333;
  background-color: #222;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 53px;
    left: 0;
    right: 0;
    height: calc(100% - 53px);
    background: linear-gradient(
      to bottom,
      #353535,
      transparent 30%,
      transparent 70%,
      #353535
    ); //根据高度来
    opacity: 0.4;
    z-index: 1;
    pointer-events: none;
    ${props => props.$hideBefore === '0' && `display: none;`}
  }
`;

const TableHead = styled.div`
  display: flex;
  background-color: #bd7c40;
  color: #e9ebf0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableHeadCell = styled.div`
  position: relative;
  padding: 16px;
  font-size: 14px;
  flex: 1;
  text-align: left;
  font-weight: 600;
  &::before {
    position: absolute;
    top: 50%;
    inset-inline-end: 0;
    width: 1px;
    height: 1.6em;
    background-color: #f0f0f0;
    transform: translateY(-50%);
    content: "";
  }
  &:last-child::before {
    background-color: transparent;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  animation-name: ${scrollAnimation};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  min-height: 107px;
`;

const TableRow = styled.div`
  display: flex;
  color: #f0f0f0;
  transition: background-color 0.2s linear;
  &:hover {
    background-color: #1d1d1d;
  }
`;

const TableCell = styled.div`
  padding: 16px;
  flex: 1;
  font-size: 14px;
  border-bottom: 1px solid #707070;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  top: 53px;
  z-index: 100;
  width: 100%;
  height: 4px;
  background-color: #dd6b66;
  animation-name: ${scrollBarAnimation};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const ScrollTable = ({
  columns,
  dataSource,
  speed = "fast",
  t,
  loading,
  showProcess = true,
}) => {
  const headerHeight = 53;
  const rowHeight = 54;

  const [duplicatedData, setNewData] = useState(dataSource)
  const [animationTime, setAnimation] = useState(0)
  useLayoutEffect(() => {
    const bodyHeight = document.getElementById('scroll-table-body').clientHeight;
    const len = dataSource.length;
    const maxRow = parseInt(bodyHeight / rowHeight)
    // 计算速率的
    const baseSpeed = {
      normal: 20,
      fast: 40,
      slow: 10,
    };
    // 超过就可以加滚动了
    if (len >= maxRow) {
      setNewData([
        ...dataSource,
        ...dataSource.map((item) => ({ ...item, key: `dup-${item.key}` })),
      ])

      const speedFactor =
      typeof speed === "number" ? speed : baseSpeed[speed] || 20;
      const totalHeight = rowHeight * dataSource.length;
      setAnimation((totalHeight / speedFactor).toFixed(2))
    }
  }, [speed, dataSource.length])

  
  const renderTableHeader = () => {
    return (
      <TableHead className="scroll-table-header">
        {columns.map((col, index) => (
          <TableHeadCell key={index}>{col.title}</TableHeadCell>
        ))}
      </TableHead>
    );
  };

  const renderTableBody = () => {
    return duplicatedData.map((row) => (
      <TableRow
        key={row.key}
        className="scroll-table-row"
        onClick={() => {
          console.log("click");
        }}
      >
        {columns.map((col, colIndex) => (
          <TableCell key={`${row.key}-${colIndex}`}>{row[col.key]}</TableCell>
        ))}
      </TableRow>
    ));
  };

  const handleAnimation = (isPause) => {
    // 没有动画则不需要停止或者开始
    if (!animationTime) {
      return;
    }
    const tbody = document.getElementById("scroll-table-body-inner");
    const bar = document.getElementById("progress-bar");
    tbody.style.animationPlayState = isPause ? "paused" : "running";
    if (bar) {
      bar.style.animationPlayState = isPause ? "paused" : "running";
    }
  };

  return (
    <TableWrapper
      $hideBefore={animationTime.toString()}
      className={`rounded-lg ${(loading || !animationTime) ? "no-before" : ""}`}
      id="scroll-table-wrapper"
    >
      {loading && <Spin />}
      {renderTableHeader()}
      {(showProcess && !!animationTime) && (
        <ProgressBar
          id="progress-bar"
          style={{ animationDuration: `${animationTime}s` }}
        />
      )}
      <div
        style={{ height: `calc(100% - ${headerHeight}px)` }}
        className="relative"
        id="scroll-table-body"
      >
        {(getType(dataSource, "array") && dataSource.length) ? (
          <TableBody
            style={{ animationDuration: `${animationTime}s` }}
            id="scroll-table-body-inner"
            onMouseEnter={() => handleAnimation(true)}
            onMouseLeave={() => handleAnimation(false)}
          >
            {renderTableBody()}
          </TableBody>
        ) : (
          <Empty t={t} size="small"></Empty>
        )}
      </div>
    </TableWrapper>
  );
};

export default ScrollTable;
