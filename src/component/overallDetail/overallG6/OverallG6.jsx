import G6 from "@antv/g6";
import { useEffect, useRef, useState, useMemo } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdZoomOutMap, MdZoomInMap } from "react-icons/md";
import './toolbar.scss'
import { debounce } from "../../../utils";
import { getFromData, getToData, checkDetail, getToken } from '../../../apis/checkApis'
import { handleData } from "./canvasUtils";
import { defaultCfg, registerX, behaviors } from "./canvasConfig";
import Spin from '../../common/Spin'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { useParams } from "react-router-dom";
import SearchIcon from "../../core/SearchIcon";
import DragCloseDrawer from "../DragCloseDrawer";
import { Table, Select } from 'antd'
import { ResetTable } from '../index'
const Tabs = ['bep20', 'bnb']
const { confirm } = Modal;
const { Option } = Select;

const OverallG6 = ({ messageApi, token, setToken }) => {
  const { type, add } = useParams()
  const [address, setAddress] = useState('')
  const [isFull, setIsFull] = useState(false)
  let nodeDataCache = useRef(null)

  useEffect(() => {
    if (type === 'bep20' || type === 'bnb') {
      setActive(type)
      setIsFull(true)
      setAddress(add)
      nodeDataCache.current = {
        [add]: {
          fromData: [],
          toData: [],
          fromLoaded: 1,
          toLoaded: 1,
        }
      }
    } else {
      setIsFull(false)
      setAddress('0x0000000000000000000000000000000000000000')
      nodeDataCache.current = {
        '0x0000000000000000000000000000000000000000': {
          fromData: [],
          toData: [],
          fromLoaded: 1,
          toLoaded: 1,
        }
      }
    }
  }, [type, add])
  const { t } = useTranslation();
  const ref = useRef(null);
  const graph = useRef(null);
  const [isZoomed, setIsZoomed] = useState(type === 'bep20' || type === 'bnb');
  const [scale, setScale] = useState(0)
  const [loading, setLoading] = useState(false)

  const zoomIn = () => {
    const currentZoom = graph.current.getZoom();
    const newZoom = Math.min(currentZoom + 0.1, graph.current.get('maxZoom'));
    graph.current.zoomTo(newZoom);
    setScale((newZoom * 100).toFixed(0));
  };

  const zoomOut = () => {
    const currentZoom = graph.current.getZoom();
    const newZoom = Math.max(currentZoom - 0.1, graph.current.get('minZoom'));
    graph.current.zoomTo(newZoom);
    setScale((newZoom * 100).toFixed(0));
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleResize)
    return () => {
      document.removeEventListener('fullscreenchange', handleResize)
    }
  }, [])

  const toFullScreen = () => {
    const divElement = ref.current;
    if (!divElement) return;
    if (divElement.requestFullscreen) {
      divElement.requestFullscreen();
    } else if (divElement.mozRequestFullScreen) {
      divElement.mozRequestFullScreen();
    } else if (divElement.webkitRequestFullscreen) {
      divElement.webkitRequestFullscreen();
    } else if (divElement.msRequestFullscreen) {
      divElement.msRequestFullscreen();
    }
  }

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }


  useEffect(() => {
    if (!ref.current || !address) {
      return;
    }
    if (!graph.current) {
      registerX(t);
      graph.current = new G6.Graph(defaultCfg(document.getElementById('overall-g6')))
      setScale(20)
      graph.current.on('wheel', () => {
        setScale((graph.current.getZoom() * 100).toFixed(0))
      });
      behaviors(graph.current, showNextPage, messageApi, t, edgeCallback)
    }
    () => {
      graph.current?.destroy();
    };
  }, [address]);

  const handleResize = debounce(() => {
    if (document.fullscreenElement) {
      setIsZoomed(true)
    } else {
      setIsZoomed(false)
      setOpen(false)
    }
    if (ref.current && graph.current) {
      const newWidth = ref.current.offsetWidth;
      const newHeight = ref.current.offsetHeight;
      graph.current.changeSize(newWidth, newHeight);
    }
  });

  const PAGE_SIZE = 10
  const fetchFromData = (address, nodeId) => {
    setLoading(true)
    getFromData(address, activeTab, token).then(res => {
      if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].from_address))) {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
        nodeDataCache.current[nodeId].fromLoaded = 1
      } else {
        const _edges = res.edges.filter(item => {
          const { from_address, to_address } = item;
          return !data.edges.some(edge => {
            let { source, target } = edge;
            source = source.split("__")[0]
            target = target.split("__")[0]
            return (source === from_address && target === to_address) || (source === to_address && target === from_address)
          }
          );
        })
        const { nodes, edges } = handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId, 'from')
        nodeDataCache.current[nodeId].fromData = _edges
        nodeDataCache.current[nodeId].fromLoaded = 1
        data = {
          nodes: [...data.nodes, ...nodes],
          edges: [...data.edges, ...edges]
        }
        graph.current.data(data)
        graph.current.render();
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const fetchToData = (address, nodeId) => {
    setLoading(true)
    getToData(address, activeTab, token).then(res => {
      if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].to_address))) {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
        nodeDataCache.current[nodeId].toLoaded = 1
      } else {
        const _edges = res.edges.filter(item => {
          const { from_address, to_address } = item;
          return !data.edges.some(edge => {
            let { source, target } = edge;
            source = source.split("__")[0]
            target = target.split("__")[0]
            return (source === from_address && target === to_address) || (source === to_address && target === from_address)
          }
          );
        })
        const { nodes, edges } = handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId, 'to')
        nodeDataCache.current[nodeId].toData = _edges
        nodeDataCache.current[nodeId].toLoaded = 1
        data = {
          nodes: [...data.nodes, ...nodes],
          edges: [...data.edges, ...edges]
        }
        graph.current.data(data)
        graph.current.render();
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const fetchLocalFrom = (nodeId, address, loadedCount, transactions) => {
    nodeDataCache.current[nodeId].fromLoaded = loadedCount + 1;
    const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
    const { nodes, edges } = handleData(nextPage, address, false, nodeId, 'from')
    data = {
      nodes: [...data.nodes, ...nodes],
      edges: [...data.edges, ...edges]
    }
    graph.current.data(data)
    graph.current.render();
  }
  const fetchLocalTo = (nodeId, address, loadedCount, transactions) => {
    nodeDataCache.current[nodeId].toLoaded = loadedCount + 1;
    const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
    const { nodes, edges } = handleData(nextPage, address, false, nodeId, 'to')
    data = {
      nodes: [...data.nodes, ...nodes],
      edges: [...data.edges, ...edges]
    }
    graph.current.data(data)
    graph.current.render();
  }
  function showNextPage(address, direction, nodeId) {
    let nodeCache = nodeDataCache.current[nodeId];
    if (!nodeCache) {
      nodeDataCache.current[nodeId] = {
        fromData: [],
        toData: [],
        fromLoaded: 0,
        toLoaded: 0
      };
      if (direction === 'from') {
        fetchFromData(address, nodeId)
      } else {
        fetchToData(address, nodeId)
      }
    } else {
      const transactions = direction === 'from' ? nodeCache.fromData : nodeCache.toData;
      const loadedCount = direction === 'from' ? nodeCache.fromLoaded : nodeCache.toLoaded;
      if (loadedCount === 0) {
        if (direction === 'from') {
          fetchFromData(address, nodeId)
        } else {
          fetchToData(address, nodeId)
        }
      }
      else if (transactions.length > loadedCount * PAGE_SIZE) {
        if (direction === 'from') {
          fetchLocalFrom(nodeId, address, loadedCount, transactions)
        } else {
          console.log(loadedCount, transactions);
          fetchLocalTo(nodeId, address, loadedCount, transactions)
        }
      } else {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
      }
    }
  }

  let data = {
    nodes: [], edges: []
  }

  const [options, setOptions] = useState([])
  const initData = (tab, token) => {
    setLoading(true)
      if (!options.length) {
        getToken(address).then(tokenData => {
          setOptions(tokenData)
        })
      }
      Promise.all([getToData(address, tab, token), getFromData(address, tab, token)]).then(([toData, fromData]) => {
      const fromEdges = fromData?.edges || []
      const toEdges = toData?.edges || []
      const _fromData = handleData(fromEdges.slice(0, PAGE_SIZE), address, true, undefined, 'from')
      const _toData = handleData(toEdges.slice(0, PAGE_SIZE), address, false, undefined, 'to')
      data = {
        nodes: [..._fromData.nodes, ..._toData.nodes],
        edges: [..._fromData.edges, ..._toData.edges]
      }
      nodeDataCache.current[address].fromData = fromEdges
      nodeDataCache.current[address].toData = toEdges
      graph.current.data(data)
      graph.current.render()
    }).finally(() => {
      setLoading(false)
    })
  }

  const [activeTab, setActive] = useState('bep20')

  const activeTabRef = useRef(activeTab);
  const isZoomedRef = useRef(isZoomed);
  const tokenRef = useRef(token)
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    isZoomedRef.current = isZoomed;
  }, [isZoomed]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token])

  const [open, setOpen] = useState(false);
  const columns = [
    {
      title: t('G6.time'),
      dataIndex: "block_time",
      key: "block_time",
    },
    {
      title: t('G6.amount'),
      dataIndex: "raw_amount",
      key: "raw_amount",
    },
    {
      title: t('G6.hash'),
      dataIndex: "trans_hash",
      key: "trans_hash",
    }
  ]
  const [dataSource, setDataSource] = useState([])
  const showDetail = (fromAddress, toAddress) => {
    const tokenAddress = activeTabRef.current === 'bnb' ? undefined : tokenRef.current
    setLoading(true)
    checkDetail({ fromAddress, toAddress, tokenAddress }, activeTabRef.current).then((data) => {
      setDataSource(data)
      setOpen(true)
    }).finally(() => {
      setLoading(false)
    })
  }

  const edgeCallback = (fromAddress, toAddress, count) => {
    if (!isZoomedRef.current) return;
    if (count > 500) {
      confirm({
        content: t('loadingLong'),
        okText: t('OK'),
        cancelText: t('Cancel'),
        onOk() {
          showDetail(fromAddress, toAddress)
        },
      });
    } else {
      showDetail(fromAddress, toAddress)
    }
  }
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const paginatedData = useMemo(() => {
    return dataSource.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [dataSource, currentPage]);
  const paginationConfig = {
    current: currentPage,
    pageSize,
    total: dataSource.length,
    onChange: (page) => {
      setCurrentPage(page);
    },
    showSizeChanger: false,
  };

  useEffect(() => {
    if (!open) {
      // 关闭后重置page和data
      setCurrentPage(1);
      setDataSource([]);
    }
  }, [open])

  const changeTab = (tab) => {
    if (tab === activeTab) return
    confirm({
      title: t('sureTitle'),
      content: t('sureContent'),
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      okText: t('OK'),
      cancelText: t('Cancel'),
      onOk() {
        nodeDataCache.current = null
        setActive(tab)
      },
    });
  }

  useEffect(() => {
    if (!address) return;
    data = { nodes: [], edges: [] }
    nodeDataCache.current = {
      [address]: {
        fromData: [],
        toData: [],
        fromLoaded: 1,
        toLoaded: 1,
      }
    };
    initData(activeTab, token)
  }, [activeTab, address, token])

  const handleSearch = (searchValue) => {
    if (!graph.current) return;
    graph.current.setAutoPaint(false);
    graph.current.getNodes().forEach((node) => {
      graph.current.setItemState(node, 'highlight', false);
    });
    graph.current.getEdges().forEach((edge) => {
      graph.current.setItemState(edge, "highlight_in", false);
      graph.current.setItemState(edge, "highlight_out", false);
    });
    graph.current.paint()
    graph.current.setAutoPaint(true);
    let count = 0;
    graph.current.getNodes().forEach((node) => {
      const model = node.getModel();
      if (model.address === searchValue) {
        count++
        graph.current.setItemState(node, 'highlight', true);
      }
    });
    if (count > 0) {
      messageApi?.open({
        type: 'success',
        content: t('found_address', { count }),
      });
    }
  }

  const handleTokenChange = (value) => {
    confirm({
      title: t('sureTitle'),
      content: t('sureContent'),
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      okText: t('OK'),
      cancelText: t('Cancel'),
      onOk() {
        nodeDataCache.current = null;
        if (!value) {
          setToken('0x55d398326f99059ff775485246999027b3197955')
        } else {
          setToken(value)
        }
      },
    });
  }

  return (
    <div ref={ref} className="w-full h-full overflow-hidden"
      style={{
        maxHeight: type === 'bep20' || type === 'bnb' ? 'none' : '500px',
      }}
    >
      {loading && <Spin />}
      <div id='overall-g6' className={"w-full h-full overflow-hidden bg-gray-950 z-50"}>
        <div className="absolute top-4 left-4"
          style={{
            marginTop: type === 'bep20' || type === 'bnb' ? '80px' : '0px',
          }}
        >
          <SearchIcon onSearch={handleSearch} />
        </div>
        {
          options.length && (
            <div className="absolute top-4 left-[50%] flex gap-4" style={{
              marginTop: type === 'bep20' || type === 'bnb' ? '80px' : '0px',
              transform: 'translateX(-50%)',
            }}>
              <div className="leading-8">Token</div>
              <Select
                style={{ width: 200 }}
                placeholder="Select an option"
                virtual
                showSearch
                allowClear
                value={token}
                onChange={handleTokenChange}
              >
                {
                  options.map(item => {
                    return (
                      <Option key={item.tokenAddress} value={item.tokenAddress}>
                        {item.symbol}
                      </Option>
                    )
                  })
                }
              </Select>
            </div>
          )
        }
        <ul className="tool-bar flex absolute bottom-4 text-sm justify-end right-4 rounded font-thin">
          <li><FaPlus onClick={zoomIn} /></li>
          <li style={{ cursor: 'unset' }}><p>{scale}</p></li>
          <li ><FaMinus onClick={zoomOut} /></li>
          <li className={`${isFull ? 'pointer-events-none opacity-70' : ''}`}>{
            isZoomed ? <MdZoomInMap onClick={exitFullScreen} />
              : <MdZoomOutMap onClick={toFullScreen} />
          }</li>
        </ul>
        <ul className="tool-bar flex absolute top-4 text-xs justify-end right-4 rounded font-thin"
          style={{
            marginTop: type === 'bep20' || type === 'bnb' ? '80px' : '0px',
          }}
        >
          {Tabs.map((tab) => (
            <li
              key={tab}
              className={`uppercase hover:text-themeColor select-none cursor-pointer ${activeTab === tab ? 'hover:text-white text-white bg-themeColor hover:bg-[#a46c39] active:bg-[#b78c5d]' : ''}`}
              style={{ width: 'fit-content', padding: '2px 6px' }}
              onClick={() => changeTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
      <DragCloseDrawer open={open} setOpen={setOpen} boxHeight="50vh">
        <ResetTable>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => "tab_" + record.id}
            pagination={paginationConfig}
            scroll={{ y: 'calc(50vh - 164px)' }}
          ></Table>
        </ResetTable>
      </DragCloseDrawer>
    </div>
  );
};

export default OverallG6;