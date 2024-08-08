import { useState, useRef, useEffect } from "react";
import { Checkbox, Divider } from "antd";
import styled from "styled-components";
import { FiFilter } from "react-icons/fi";

const FilterWrapper = styled.div`
  z-index: 99;
  left: -49px;
  top: 20px;
  box-shadow: 0 3px 11px 0 #585858;
`;

const FilterBox = ({ defaultCheckedList = [], options = [], onChange, t }) => {
  const [showFilter, setShowFilter] = useState(false);
  const popConfirmRef = useRef(null);
  const popBtnRef = useRef(null);
  const clickClose = (event) => {
    if (
      popConfirmRef.current &&
      !popConfirmRef.current.contains(event.target) &&
      popBtnRef.current &&
      !popBtnRef.current.contains(event.target)
    ) {
      setShowFilter(false);
    }
  };
  useEffect(() => {
    if (showFilter) {
      window.addEventListener("mousedown", clickClose);
    } else {
      window.removeEventListener("mousedown", clickClose);
    }
    return () => {
      document.removeEventListener("mousedown", clickClose);
    };
  }, [showFilter]);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const checkAll = options.length === checkedList.length;
  const remainCheckList = options
    .filter((item) => item.disabled)
    .map((val) => val.value);
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const handleCheck = (list) => {
    setCheckedList(list);
    onChange(list);
  };

  const onCheckAllChange = (e) => {
    const list = e.target.checked ? options.map(it => it.value) : remainCheckList;
    handleCheck(list);
  };
  return (
    <div className="flex items-center w-full">
      <div
        ref={popBtnRef}
        onClick={() => {
          setShowFilter(!showFilter);
        }}
      >
        <FiFilter
          className={`${
            showFilter && "text-themeColor"
          } " text-xs hover:text-themeColor cursor-pointer relative filter-btn"`}
        ></FiFilter>
      </div>
      <div className="relative ml-1">
        <FilterWrapper
          ref={popConfirmRef}
          className={`${
            showFilter ? "h-auto opacity-100" : "h-0 opacity-0"
          } "transition-all duration-500 w-[300px] overflow-hidden absolute top-0 left-0 bg-boardBg rounded-lg`}
        >
          <div className="m-4">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            {t('check-all')}
          </Checkbox>
          <Divider style={{ margin: "14px 0" }} />
          <Checkbox.Group
            className=""
            options={options}
            value={checkedList}
            onChange={handleCheck}
          />
          </div>
        </FilterWrapper>
      </div>
    </div>
  );
};

export default FilterBox;
