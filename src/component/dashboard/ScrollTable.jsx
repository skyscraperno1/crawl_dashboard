import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { getType } from "../../utils";
import Empty from "../common/Empty";
const scrollAnimation = keyframes`
  to {
    transform: translateY(-50%);
  }
`;

const TableWrapper = styled.div`
  width: 100%;
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
  &:hover {
    animation-play-state: paused;
  }
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
`;

const ScrollTable = ({ columns, dataSource, speed = "normal", t }) => {
  const rowHeight = 54;
  const headerHeight = 53;

  let duplicatedData = [];
  // 计算表格高度，保证滚动下面不会有空白
  const getHeight = useMemo(() => {
    if (dataSource.length <= 2) {
      duplicatedData = dataSource;
      return rowHeight * 4 + headerHeight;
    } else {
      duplicatedData = [
        ...dataSource,
        ...dataSource.map((item) => ({ ...item, key: `dup-${item.key}` })),
      ];
      return Math.min(dataSource.length * rowHeight + headerHeight, 500);
    }
  }, [dataSource.length]);
  // 计算动画时长，设置滚动的速度
  const getAnimationTime = useMemo(() => {
    const baseSpeed = {
      normal: 20,
      fast: 40,
      slow: 10,
    };
    if (dataSource.length <= 2) {
      return 0;
    }
    const speedFactor =
      typeof speed === "number" ? speed : baseSpeed[speed] || 20;
    const estimatedRowHeight = 54;
    const totalHeight = estimatedRowHeight * dataSource.length;
    const animationTime = `${(totalHeight / speedFactor).toFixed(2)}s`;
    return animationTime;
  }, [speed, dataSource.length]);
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
      <TableRow key={row.key} className="scroll-table-row">
        {columns.map((col, colIndex) => (
          <TableCell key={`${row.key}-${colIndex}`}>{row[col.key]}</TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <TableWrapper
      style={{ height: `${getHeight}px` }}
      className="rounded-lg scroll-table-wrapper"
    >
      {renderTableHeader()}
      {getType(dataSource, "array") && dataSource.length ? (
        <TableBody
          style={{ animationDuration: getAnimationTime }}
          className="scroll-table-body"
        >
          {renderTableBody()}
        </TableBody>
      ) : (
        <div style={{ height: `${getHeight - headerHeight}px` }}>
          <Empty t={t} size="small"></Empty>
        </div>
      )}
    </TableWrapper>
  );
};

export default ScrollTable;
