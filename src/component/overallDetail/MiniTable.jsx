import styled from "styled-components";
import { Table, Badge, Radio } from "antd";
import { useRef, useMemo, useEffect, useState } from 'react'
import { parseWbText } from '../../utils';
const TableWrapper = styled.div`
  margin-top: 4px;
  border-radius: 8px;
  overflow: hidden;
  .ant-table-wrapper {
    height: 100%;
    overflow-x: overlay;
    .ant-table-cell {
      font-size: 12px;
    }
    .ant-spin-nested-loading {
      height: 100%;
      .ant-spin-container {
        height: 100%;
        .ant-table-content {
          height: 100%;
          table {
            height: 100%;
          }
        }
        .ant-table {
          height: 100%;
          .ant-table-container {
            height: 100%;
            .ant-table-cell {
              border: none;
            }
          }
        }
      }
    }
    .ant-table-tbody {
      .ant-table-row {
        cursor: pointer;
      }
      .ant-table-row:nth-child(even) {
        background-color: #303135;
      }
    }
  }
`;
const MiniTable = ({ t, id, options, emitData }) => {
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(options.children[0].value);

  const hiddenTag = (tab, key) => {
    if (tab === "wb" || tab === "dy" || tab === "xhs") {
      return key !== "title" && key !== "description";
    } else if (tab === "wx" || tab === "tg" || tab === "qq") {
      return key !== "chatMsg";
    } else if (tab === "baidu" || tab === "bing" || tab === "google") {
      return key === "id" || key === "coinId" || key === "link" || key === 'coinName';
    }
  };
  const getTableData = (tab) => {
    setLoading(true);
    let params = {
      key: tab,
      coinId: id,
    };
    if (tab === "wx" || tab === "tg" || tab === "qq") {
      params.token = id;
      params.coinId = undefined;
    }
    options
      .api(params)
      .then((data) => {
        if (!data.length) {
          setColumns([]);
          setTableData([]);
          setLoading(false);
          return;
        }
        let _columns = Object.keys(data[0]).map((key) => {
          return {
            key,
            dataIndex: key,
            ellipsis: true,
            hidden: hiddenTag(tab, key),
          };
        });
        setColumns(_columns);
        if (tab === 'wb') {
          data = data.map(it => {
            return {
              ...it,
              description: parseWbText(it.description)
            }
          })
        }
        setTableData(data)
        setLoading(false);
      })
      .catch(() => {
        setColumns([]);
        setTableData([]);
        setLoading(false);
      });
  };

  const _columns = useMemo(() => {
    return columns.map((it) => {
      const { key } = it
      return {
        ...it,
        title: tab === 'wb' && key === 'title' ? t("overallDetail.author") : t("overallDetail." + key),
      }
    })
  }, [t, columns]);

  useEffect(() => {
    if (!id) return;
    getTableData(tab);
  }, [id, tab]);
  const ref = useRef(null);
  const y = useMemo(() => {
    if (tableData.length && ref.current) {
      return ref.current.offsetHeight - 80;
    } else {
      return undefined;
    }
  }, [ref.current, tableData]);
  return (
    <div className="flex flex-col h-full w-full" ref={ref}>
      <div className="h-8 flex justify-between px-2">
        <div>{t('overallDetail.' + options.value)}</div>
        <Radio.Group
          size="small"
          buttonStyle="solid"
          value={tab}
          onChange={(e) => {
            setTab(e.target.value);
          }}
        >
          {options.children.map((child) => (
            <Badge
              key={child.value}
              count={child.count}
              size="small"
              style={{ zIndex: 40 }}
            >
              <Radio.Button value={child.value}>{t('overallDetail.' + child.value)}</Radio.Button>
            </Badge>
          ))}
        </Radio.Group>
      </div>
      <TableWrapper className="flex-1">
        <Table
          columns={_columns}
          dataSource={tableData}
          loading={loading}
          pagination={false}
          size="middle"
          scroll={{ y: y }}
          rowKey={(record) => tab + record.id}
          onRow={() => {
            return {
              onClick: () => {
                emitData(_columns, tableData);
              },
            };
          }}
        />
      </TableWrapper>
    </div>
  );
};

export default MiniTable