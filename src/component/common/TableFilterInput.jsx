import { FaSearch } from "react-icons/fa";
import { Input, Space, Button } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  box-shadow: 0 3px 11px 0 #585858;
  margin: 1px;
`
const TableFilterInput = ({
  t,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  dataIndex,
  onChange = () => {},
}) => {
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    onChange(dataIndex, selectedKeys[0]);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    onChange(dataIndex, "");
  };
  return (
    <Wrapper className="p-2 rounded-md" onKeyDown={(e) => e.stopPropagation()}>
      <Input
        placeholder={`${t('search')}${t(dataIndex)}`}
        value={selectedKeys[0]}
        className="block mb-2"
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<FaSearch />}
          size="small"
          style={{
            width: 90,
          }}
        >
          {t('search')}
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          {t('reset')}
        </Button>
      </Space>
    </Wrapper>
  );
};

export default TableFilterInput;