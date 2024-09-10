import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, Pagination, DatePicker, Input, Radio } from "antd";
import * as apis from '../../apis/assetCollectionApis'
import { getDomains } from "../../apis/assectCollMain";
import dayjs from 'dayjs';
import { debounce, copyText } from "../../utils";
const Main = styled.main`
  min-height: calc(100vh - 180px);
  margin: 0 auto;
`;
const ResetTable = styled.div`
  .ant-table-wrapper {
    margin-top: 20px;
    overflow-x: overlay;
    .striped-row {
      background-color: #303135;
    }
  }
`
const { RangePicker } = DatePicker;
const { Group, Button } = Radio

const disabledDate = (current) => {
  return current && current.isAfter(dayjs());
};

const selectOptions = Object.keys(apis).map((key) => ({
  value: key,
  label: key.slice(2),
}))
let currentReq = apis[selectOptions[0].value];
const AssetMain = ({ t, messageApi }) => {
  const [reqData, setReqData] = useState({
    domain: "",
    startTime: null,
    endTime: null,
    pageNum: 1,
    pageSize: 20,
  });

  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initData();
  }, [reqData]);

  const [domains, setDomains] = useState([])
  const getDomain = () => {
    getDomains().then((data) => {
      setDomains(data)
    })
  }

  const initData = () => {
    setLoading(true)
    currentReq(reqData).then(res => {
      setTotal(res.total)
      const _columns = Object.keys(res.records[0]).map((key) => {
        return {
          key,
          title: key,
          dataIndex: key,
          hidden: key === 'id',
          ellipsis: true,
        }
      })
      if (res.records.length) {
        setColumns(_columns)
        setTableData(res.records)
      } else {
        setColumns([])
        setTableData([])
      }
      setLoading(false)
    }).catch(() => {
      setColumns([])
      setTableData([])
      setLoading(false)
    })
  };

  const handleClick = (e) => {
    if (e.target.classList.contains('ant-table-cell-ellipsis')) {
      copyText(e.target.innerText, () => {
        messageApi.open({
          type: 'success',
          content: t("copy-success"),
        });
      })
    }
  }

  useEffect(() => {
    getDomain()
    window.addEventListener('dblclick', handleClick)
    return () => {
      window.removeEventListener("dblclick", handleClick);
    };
  }, [])
 
  const selectChange = (val) => {
    currentReq = apis[val];
    initData()
  }

  const [iptValue, setInput] = useState('')
  const onInputChange = (e) => {
    setInput(e.target.value || '')
  }

  const debounceInput = debounce((val) => {
    setReqData({
      ...reqData,
      domain: val
    });
  }, 600)

  useEffect(() => {
    debounceInput(iptValue)
  }, [iptValue])
  
  const onPageChange = (pageNum, pageSize) => {
    if (pageSize !== reqData.pageSize) {
      pageNum = 1;
    }
    setReqData({
      ...reqData,
      pageNum,
      pageSize,
    });
  };
  const rowClassName = (_, index) => {
    // 给偶数行添加一个类名，用于设置背景色
    return index % 2 === 0 ? "striped-row" : undefined;
  };
  function onDateChange(date) {
    if (!date) {
      setReqData({
        ...reqData,
        startTime: null,
        endTime: null,
      });
      return;
    }
    let [startTime, endTime] = date;
    if (endTime) {
      setReqData({
        ...reqData,
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf()
      })
    }
  }

  function setDomain(e) {
    let val = ''
    if (e.target.value !== iptValue) {
      val = e.target.value
    } 
    setInput(val)
  }

  return (
    <section className="bg-neutral-950 pt-[80px] w-full h-full">
      <Main className="lg:px-24 px-8 bg-boardBg py-8">
        <section className="flex gap-6">
          <Group onChange={(e) => selectChange(e.target.value)} defaultValue={selectOptions[0].value}>
            {
              selectOptions.map(it => {
                return (
                  <Button value={it.value} key={it.value}>{it.label}</Button>
                )
              })
            }
          </Group>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            onChange={onDateChange}
            className="min-w-80"
          />
          <Input onChange={onInputChange} placeholder={t("placeholder")} value={iptValue} className="w-96" allowClear/>
        </section>
        <section>
          {
            domains.length > 0 && (
              <Group className="mt-2" size='small' buttonStyle="solid" value={iptValue}>
                {
                  domains.map(it => {
                    return (
                      <Button value={it} key={it} onClick={(e) => {
                        setDomain(e)
                      }}>{it}</Button>
                    )
                  })
                }
              </Group>
            )
          }
        </section>

        <ResetTable>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            loading={loading}
            size="middle"
            rowKey={(record) => record.id}
            rowClassName={rowClassName}
          />
          <Pagination
            current={reqData.pageNum}
            pageSize={reqData.pageSize}
            total={total}
            onChange={onPageChange}
          />
        </ResetTable>
      </Main>
    </section>
  );
}


export default AssetMain;
