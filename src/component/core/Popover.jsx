import useClickOutside from '../../utils/useClickOutside';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useRef, useState, useEffect, useId, useMemo } from 'react';
import { Table, } from 'antd';
import './Custom.scss'
import CopyText from './CopyText';

const TRANSITION = {
  type: 'spring',
  bounce: 0.05,
  duration: 0.3,
  // ease: 'easeInOut',
  // stiffness: 140,
  // damping: 20
};

export default function Popover({ data, t, messageApi }) {
  const uniqueId = useId();
  const formContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { title: t('name'), dataIndex: 'name', key: 'name', ellipsis: true, width: 180 },
    { title: t('liquidity'), dataIndex: 'liquidity', key: 'liquidity', ellipsis: true, width: 150 },
    { title: t('pair'), dataIndex: 'pair', key: 'pair', ellipsis: true, render: (text) => {
      return <CopyText text={text} messageApi={messageApi} />
    }}
  ]

  const _data = useMemo(() => {
    return data.map((it, index) => {
      return {
        ...it,
        liquidity: Number(it.liquidity/10000).toFixed(2),
        key: index,
      }
    })
  }, [data])
  
  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useClickOutside(formContainerRef, (event) => {
    const tooltip = event.target.closest('.custom-tooltip')
    if (!tooltip) {
      closeMenu();
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <MotionConfig transition={TRANSITION}>
      <div className='relative flex items-center justify-center h-6 w-[68px]'>
        <motion.div
          key='button'
          layoutId={`popover-${uniqueId}`}
          className='flex h-full w-full justify-center items-center border border-zinc-50/10 bg-zinc-700 text-zinc-50 cursor-pointer'
          style={{
            borderRadius: 4,
          }}
          onClick={openMenu}
        >
          <span
            layoutId={`popover-label-${uniqueId}`}
            className='text-xs text-center'
          >
            {data.length}
          </span>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={formContainerRef}
              layoutId={`popover-${uniqueId}`}
              className='absolute overflow-hidden border border-zinc-950/10 outline-none bg-zinc-700 z-50'
              style={{
                borderRadius: 12,
                maxHeight: '234px',
                width: '700px'
              }}
            > 
            <Table 
              columns={columns} 
              dataSource={_data} 
              pagination={false} 
              scroll={{ y: 200 }}
              className='small-table'
            ></Table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
