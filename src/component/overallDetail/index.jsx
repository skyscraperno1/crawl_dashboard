import { useTranslation } from "react-i18next";
import { getOverDetail } from "../../apis/dashBoardApis";
import { NameCell, LiquidityChangeCell } from "../OverAllCase/OverAllCase";
import { Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { _options, handleOptionNum, getColumnConfig } from "./detailConfig";
import styled from "styled-components";
import DragCloseDrawer from "./DragCloseDrawer";
import { cloneDeep } from "../../utils";
import MiniTable from './MiniTable'
import OverallG6 from "./overallG6/OverallG6";
import Spin from "../common/Spin";

export const ResetTable = styled.div`
  .ant-table-wrapper {
    .ant-table-cell {
      font-size: 12px;
    }
    .ant-table-tbody {
      .ant-table-row:nth-child(even) {
        background-color: #303135;
      }
    }
    .ant-pagination {
      margin-bottom: 0;
    }
  }
`;
const TitleTag = ({ title, children }) => {
  return (
    <div className="flex">
      <div className="mr-4">{title}：</div>
      <div>{children}</div>
    </div>
  );
};

const OverallDetail = ({ messageApi }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState({});
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(cloneDeep(_options));
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!id) return;
    getOverDetail(id).then((data) => {
      setToken(data.token);
      setOptions(handleOptionNum(data));
      setContent(data);
    });
  }, [id]);

  const showTable = (col, data) => {
    const newCol = col.map((item) => {
      return {
        ...item,
        hidden: false,
        ...getColumnConfig(item.key, messageApi),
      };
    });
    setColumns(newCol);
    setTableData(data);
    setOpen(true);
  }
  return (
    <div className="pt-[80px] w-full min-h-full flex flex-col overflow-hidden">
      <Row className="mt-4 px-24">
        <Col span={6}>
          <TitleTag title={t("name")}>
            <NameCell
              rCoin={content.rcoinName}
              fCoin={content.fcoinName}
              content={content}
            />
          </TitleTag>
        </Col>
        <Col span={6}>
          <TitleTag title={t("liquidity")}>{content.liquidity}</TitleTag>
        </Col>
        <Col span={6}>
          <TitleTag title={t("liquidityChange")}>
            <LiquidityChangeCell
              t={t}
              content={content}
              text={content.liquidityChange}
            />
          </TitleTag>
        </Col>
      </Row>
      {/* 中间部分 */}
      <section className="flex-1 grid grid-cols-4 grid-rows-3 gap-6 py-4 px-10 h-full">
        {/* 社交媒体 */}
        <div className="row-span-2">
          <MiniTable
            t={t}
            id={id}
            options={options[1]}
            emitData={(col, data) => { showTable(col, data) }}
          />
        </div>
        {/* G6图 */}
        <div className="col-span-2 row-span-2 rounded relative">
          {token ? <OverallG6 messageApi={messageApi} token={token}/> : <Spin />}
        </div>
        {/* 社群消息 */}
        <div className="row-span-2">
          <MiniTable
            t={t}
            id={token}
            options={options[2]}
            emitData={(col, data) => { showTable(col, data) }}
          />
        </div>
        {/* 搜索引擎 */}
        <div className="col-span-4">
          <MiniTable
            t={t}
            id={id}
            options={options[0]}
            emitData={(col, data) => { showTable(col, data) }}
          />
        </div>
      </section>

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <ResetTable>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="middle"
            rowKey={(record) => "tab_" + record.id}
            scroll={{ y: 'calc(85vh - 116px)' }} 
            onRow={(row) => {
              return {
                onDoubleClick: () => {
                  const link = row?.link || row?.url || ''
                  if (link) {
                    window.open(link)
                  }
                },
              };
            }}
          />
        </ResetTable>
      </DragCloseDrawer>
    </div>
  );
};

export default OverallDetail;
