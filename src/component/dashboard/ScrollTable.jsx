import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table } from 'antd';
import './tabs.scss'

const ScrollingTable = () => {
  const contentRef = useRef(null);
  const tableHeight = 498; // Adjust based on the visible height of the table

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      width: 150,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ]; 

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '5',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '6',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '7',
      name: 'Joe Black7',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    // {
    //   key: '8',
    //   name: 'Joe Black8',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // },
    // {
    //   key: '9',
    //   name: 'Joe Black9',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // },
    // {
    //   key: '10',
    //   name: 'Joe Black10',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // },
  ];
  
  const duplicatedData = [...data, ...data.map((item, index) => ({ ...item, key: `dup-${index + 1}` }))];

  return (
    <div
      className='rounded-lg relative overflow-hidden border bg-boardBg'
      style={{ height: `${tableHeight}px`,  }}
    >
      <div className='overflow-hidden relative h-full'>
        <div className="fixed-header">
          <Table
            columns={columns}
            dataSource={[]}
            pagination={false}
            showHeader={true}
          />
        </div>
        <div ref={contentRef} className={`scrolling-content`}>
          <Table
            columns={columns}
            dataSource={duplicatedData}
            pagination={false}
            showHeader={false}
            rowKey="key"
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollingTable;
