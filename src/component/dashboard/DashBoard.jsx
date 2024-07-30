import { useState } from "react";
import ScrollTable from './ScrollTable'
const tabs = [
  { icon: "🍅", label: "Tomato" },
  { icon: "🥬", label: "Lettuce" },
  { icon: "🧀", label: "Cheese" },
  { icon: "🥕", label: "Carrot" },
  { icon: "🍌", label: "Banana" },
  { icon: "🫐", label: "Blueberries" },
  { icon: "🥂", label: "Champers?" }
]

const columns = [
  { title: '姓名', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
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
  // {
  //   key: '11',
  //   name: 'Joe Black11',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  // },
  // {
  //   key: '12',
  //   name: 'Joe Black12',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  // },
  // {
  //   key: '13',
  //   name: 'Joe Black13',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  // },
];
const DashBoard = ({ t }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
 
  return (
    <div className="pt-20 place-items-center">
      <ScrollTable columns={columns} dataSource={data} t={t} />
      {/* <nav>
        <ul>
          {tabs.map((item) => (
            <li
              key={item.label}
              className={item === selectedTab ? "selected" : ""}
              onClick={() => setSelectedTab(item)}
            >
              {`${item.icon} ${item.label}`}
              {item === selectedTab ? (
                <motion.div className="underline" layoutId="underline" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab ? selectedTab.icon : "😋"}
          </motion.div>
        </AnimatePresence>
      </main> */}
    </div>
  );
}

export default DashBoard;