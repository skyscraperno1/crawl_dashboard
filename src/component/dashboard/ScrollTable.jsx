import React, { useEffect, useLayoutEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { calValueType } from "../../utils";
import Empty from "../common/Empty";
import Spin from "../common/Spin";
import CopyText from "../core/CopyText";
import bsc from "/src/assets/nets/bsc.png";
import solana from "../../assets/nets/solana.png";
import eth from "../../assets/nets/eth.png";
import polygon from "../../assets/nets/polygon.png";
import arbitrum from "../../assets/nets/arbitrum.png";
const nets = {
  bsc,
  solana,
  eth,
  polygon,
  arbitrum,
};
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
  background-color: #222;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    height: calc(100% - 50px);
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
  background-color: #1D1D1D;
  font-size: 12px;
  font-weight: 600;
  color:rgba(255, 255, 255, 0.85);
  position: sticky;
  z-index: 10;
`;

const TableHeadCell = styled.div`
  position: relative;
  padding: 16px;
  flex: ${props => props.$width ? 'none' : '1'};
  width: ${props => props.$width ? props.$width : 'auto'};
  text-align: left;
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
`;

const TableRow = styled.div`
  display: flex;
  color: #f0f0f0;
  line-height: 21px;
  background-color: #141414;
  transition: background-color 0.2s linear;
  &:hover {
    background-color: #1d1d1d;
  }
`;

const TableCell = styled.div`
  padding: 16px;
  height: 49px;
  flex: ${props => props.$width ? 'none' : '1'};
  width: ${props => props.$width ? props.$width : 'auto'};
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid #303030;
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  top: 49px;
  z-index: 100;
  width: 100%;
  height: 2px;
  border-radius: 1px;
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
  messageApi
}) => {
  const headerHeight = 50;
  const rowHeight = 49;



  const [duplicatedData, setNewData] = useState([])
  const [animationTime, setAnimation] = useState(0)
  const [isScroll, setScroll] = useState(true)

  const calcAnimation = () => {
    const baseSpeed = {
      normal: 20,
      fast: 40,
      slow: 10,
    };
    setNewData([
      ...dataSource,
      ...dataSource.map((item) => ({ ...item, id: `dup-${item.id}` })),
    ])

    const speedFactor = typeof speed === "number" ? speed : baseSpeed[speed] || 20;
    const totalHeight = rowHeight * dataSource.length;
    setAnimation((totalHeight / speedFactor).toFixed(2))
  }
 
  useLayoutEffect(() => {
    const scrollBody = document.getElementById('scroll-table-body');
    const len = dataSource.length;
    const maxRow = parseInt(scrollBody.clientHeight / rowHeight)

    // 超过就可以加滚动了
    if (len >= maxRow && isScroll) {
      scrollBody.style.overflowY = ''
      calcAnimation()
    } else {
      scrollBody.style.overflowY = 'overlay'
      setAnimation(0)
      setNewData(dataSource)
    }
  }, [speed, dataSource.length, isScroll])

  
  const renderTableHeader = () => {
    return (
      <TableHead className="scroll-table-header">
        {columns.map((col, index) => (
          <TableHeadCell $width={col.width} key={index} className="truncate">{col.title}</TableHeadCell>
        ))}
      </TableHead>
    );
  };

  const TableCellContent = ({keyName, text, content}) => {
    if (keyName === 'name') {
      const [rCoin, fCoin] = text.split('/')
      return (
      <div className="flex items-center">
        {content.net && (
          <img
            className="w-4 h-4 mr-1 align-middle rounded-full"
            src={nets[content.net]}
            alt=""
            title={content.net}
          />
        )}
        <span className="text-xs">{rCoin}</span>
        {fCoin && <span className="text-neutral-400">/{fCoin}</span>}
      </div>
      )
    } else if (keyName === 'token') {
      return <CopyText text={text} messageApi={messageApi}/>
    } else {
      return <span>{text}</span>
    }
  }
  const renderTableBody = () => {
    return duplicatedData.map((row) => (
      <TableRow
        key={row.id}
        className="scroll-table-row"
      >
        {columns.map((col, colIndex) => (
          <TableCell $width={col.width} key={`${row.key}-${colIndex}`}>
            {<TableCellContent keyName={col.key} content={row} text={row[col.key]} />}
          </TableCell>
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
      className={`rounded ${(loading || !animationTime) ? "no-before" : ""}`}
      id="scroll-table-wrapper"
    >
      {loading && <Spin />}
      {renderTableHeader()}
      {(showProcess && !!animationTime && isScroll) && (
        <ProgressBar
          id="progress-bar"
          className="bg-blue-500"
          style={{ animationDuration: `${animationTime}s` }}
        />
      )}
      <div
        style={{ height: `calc(100% - ${headerHeight}px)`, overflowY: 'overlay' }}
        className="relative"
        id="scroll-table-body"
      >
        {(calValueType(dataSource, "array") && dataSource.length) ? (
          <TableBody
            style={{ animationDuration: `${animationTime}s`, overflowX: `${isScroll ? 'hidden' : ''}` }}
            id="scroll-table-body-inner"
            onMouseEnter={() => handleAnimation(true)}
            onMouseLeave={() => handleAnimation(false)}
            onClick={() => {
              setScroll(prev => !prev)
            }}
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
