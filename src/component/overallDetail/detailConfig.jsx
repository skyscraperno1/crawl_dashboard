import { getTokenInfo, getCoinInfo, getSearchInfo } from "../../apis/dashBoardApis";
import { Tag } from "antd";
import CopyText from "../core/CopyText";
export const _options = [
  {
    label: '搜索引擎', value: 'searchEngine', api: getSearchInfo, children: [
      { label: '百度', value: 'baidu', count: 0 },
      { label: '必应', value: 'bing', count: 0 },
      { label: '谷歌', value: 'google', count: 0 },
    ]
  },
  {
    label: '社交媒体', value: 'socialMedia', api: getCoinInfo, children: [
      { label: '小红书', value: 'xhs', count: 0 },
      { label: '抖音', value: 'dy', count: 0 },
      { label: '微博', value: 'wb', count: 0 },
    ]
  },
  {
    label: '社群消息', value: 'community', api: getTokenInfo, children: [
      { label: '微信', value: 'wx', count: 0 },
      { label: '电报', value: 'tg', count: 0 },
      { label: 'QQ', value: 'qq', count: 0 },
    ]
  },
];

export const handleOptionNum = (data) => {
  Object.keys(data).forEach((key) => {
    const count = data[key]
    _options.forEach(parent => {
      const addKey = parent.value === 'community' ? 'MsgCount' : 'Count'
      parent.children.forEach((child) => {
        if (child.value + addKey === key) {
          child.count = count
        }
      })
    })
  }) 
  return _options
}

export const getColumnConfig = (key, messageApi, tab) => {
   if (key === 'uid' || key === 'chatRoomId') {
    return {
      hidden: tab === 'tg'
    }
  } else if (key === 'id' || key === 'coinId' || key === 'url' || key === 'link') {
    return {
      hidden: true
    }
  } else if (key === 'token' || key === 'description' || key === 'content' || key === 'chatMsg') {
    return {
      render: (text) => <CopyText text={text} messageApi={messageApi}  showIcon={key === 'token'}/>
    }
  } else if (key === 'time') {
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