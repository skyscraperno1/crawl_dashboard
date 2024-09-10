import { Radio, Badge, Table, Tag } from 'antd';
import { useEffect, useState } from 'react'
import * as apis from '../../apis/dashBoardApis'
import { getOverDetailNum } from '../../apis/dashBoardApis'
import styled from "styled-components";
import { debounce } from "../../utils";
import { getAddress, getType } from '../Detail/canvasUtils';
import { useTranslation } from 'react-i18next';
import { parseWbText } from '../../utils';
import CopyText from '../core/CopyText';
let _options = [
  {
    label: '搜索引擎', value: 'searchEngine', count: 0, children: [
      { label: '百度', value: 'baidu', count: 0 },
      { label: '必应', value: 'bing', count: 0 },
      { label: '谷歌', value: 'google', count: 0 },
    ]
  },
  {
    label: '社交媒体', value: 'socialMedia', count: 0, children: [
      { label: '小红书', value: 'xhs', count: 0 },
      { label: '抖音', value: 'dy', count: 0 },
      { label: '微博', value: 'wb', count: 0 },
    ]
  },
  {
    label: '社群消息', value: 'community', count: 0, children: [
      { label: '微信', value: 'wx', count: 1 },
      { label: '电报', value: 'tg', count: 0 },
      { label: 'QQ', value: 'qq', count: 0 },
    ]
  },
];

function findParentValue(nodeValue) {
  const parentNode = _options.find(parent => {
    return parent.children.some(child => child.value === nodeValue);
  });

  return parentNode ? parentNode.value : 'searchEngine';
}
const apiOption = {
  searchEngine: apis.getSearchInfo,
  socialMedia: apis.getCoinInfo,
  community: apis.getTokenInfo
}
const ResetTable = styled.div`
  .ant-table-wrapper {
    margin-top: 20px;
    overflow-x: overlay;
    .ant-table-tbody {
      .ant-table-cell {
        font-size: 12px;
        padding: 12px 16px!important;
      }
    }
    .striped-row {
      background-color: #303135;
    }
  }
`
const rowClassName = (_, index) => {
  return index % 2 === 0 ? "striped-row" : undefined;
};
const OverallDetail = ({messageApi}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState({
    lv1: null,
    lv2: null
  })
  const [columns, setColumns] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [options, setOptions] = useState(JSON.parse(JSON.stringify(_options)))
  const id = getAddress(window.location.pathname, 'overallDetail')
  const key = getType(window.location.pathname)

  const handleOptionNum = (data) => {
    Object.keys(data).forEach((key) => {
      const count = data[key]
      _options.forEach(parent => {
        if (parent.value === key) {
          parent.count = count
        }
        parent.children.forEach((child) => {
          if (child.value === key) {
            child.count = count
          }
        })
      })
    })
    setOptions(_options)
  }
  useEffect(() => {
    if (key === 'total') {
      setTab({
        lv1: 'searchEngine',
        lv2: 'baidu'
      })
    } else {
      const _tab = findParentValue(key)
      setTab({
        lv1: _tab,
        lv2: key
      })
    }
    getOverDetailNum(id).then((data) => {
      setToken(data.token);
      handleOptionNum(data)
    })
  }, [])

  useEffect(() => {
    if (!tab.lv1) return;
    let currentReq = apiOption[tab.lv1]
    if (tab.lv1 === 'community') {
      const params = {
        key: tab.lv2,
        token: token
      }
      if (!token) return;
      getTableData(params, currentReq)
    } else {
      const params = {
        key: tab.lv2,
        coinId: id
      }
      getTableData(params, currentReq)
    }
  }, [tab, token])

  const getColumnConfig = (key) => {
    if (key === 'url' || key === 'link') {
      return {
        render: (text) => <a href={text} target="_blank" className='hover:text-themeColor'>{text}</a>,
        width: 400,
      }
    } else if (key === 'uid' || key === 'chatRoomId') {
      return {
        hidden: tab.lv2 === 'tg'
      }
    } else if (key === 'id') {
      return {
        hidden: true
      }
    } else if (key === 'token' || key === 'description' || key === 'content' || key === 'chatMsg') {
      return {
        render: (text) => <CopyText text={text} messageApi={messageApi} showIcon={key === 'token'}/>
      }
    } else if (key === 'time'){
      return {
        width: 160
      };
    } else if (key === 'coinName') {
      return {
        width: 120
      }
    } else if (key === 'title') {
      return {
        width: 400
      }
    } else if (key === 'tagList') {
      return {
        render: (text) => {
          if (text) {
            return text.split(',').map((tag) => {
              return <Tag size="small" color="#bd7c40" className='mt-1' bordered={false}>{tag}</Tag>
            })
          } else {
            return undefined
          }
        },
        ellipsis: false
      }
    } else {
      return undefined;
    }
  }
  
  const getTableData = debounce((reqData, currentReq) => {
    setLoading(true)
    currentReq(reqData).then(data => {
      let _columns = Object.keys(data[0]).map((key) => {
        return {
          key,
          title: t('overallDetail.'+ key),
          dataIndex: key,
          ellipsis: true,
          ...getColumnConfig(key)
        }
      })
      if (data.length) {
          _columns = _columns.filter(item => 
            tab.lv2 === 'wb' 
            ? item.key !== 'title' && item.key !== 'coinId'
            : item.key !== 'coinId'
          )
          if (tab.lv2 === 'wb') {
            data.forEach(it => {
              it.description = parseWbText(it.description)
            })
          }
          setColumns(_columns)
          setTableData(data)
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
  })

  return (
    <div className="bg-neutral-950 pt-[80px] pb-[80px] w-full min-h-full px-24">
      <div className='mt-4'>
        <Radio.Group value={tab.lv1} onChange={(e) => {
          const _page = options.find(it => it.value === e.target.value).children[0].value
          setTab({
            lv1: e.target.value,
            lv2: _page
          })
        }}>
          {options.map(option => (
            <Badge key={option.value} count={option.count} size="small" style={{ zIndex: 50}}>
              <Radio.Button value={option.value}>
                {option.label}
              </Radio.Button>
            </Badge>
          ))}
        </Radio.Group>
      </div>
      <div className='mt-4'>
        {options.map(option => {
          return (option.value === tab.lv1 &&
            <Radio.Group
              buttonStyle="solid"
              key={option.value + 'lv2'}
              value={tab.lv2}
              size='small'
              onChange={(e) => {
                setTab({
                  ...tab,
                  lv2: e.target.value
                })
              }}
            >
              {option.children.map(child => (
                <Badge key={child.value} count={child.count} size='small'  style={{ zIndex: 50}}>
                  <Radio.Button value={child.value}>
                    {child.label}
                  </Radio.Button>
                </Badge>
              ))}
            </Radio.Group>
          )
        })}
      </div>
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
        </ResetTable>
    </div>
  )
}

export default OverallDetail;