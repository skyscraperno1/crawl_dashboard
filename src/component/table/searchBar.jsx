import { Input } from "antd";
function SearchBar({onChange, t}) {
  const changeAdd = (e)=> {
    onChange(e.target.value)
  }
  return (
    <div className="h-[48px] w-full flex items-center px-4">
      <div className="w-[450px] flex justify-between items-center">
        <div className="label text-text mr-6 text-center w-[100px]">{t('address')}</div>
        <Input onChange={changeAdd} 
          allowClear={true} 
        ></Input>
      </div>
    </div>
  );
}

export default SearchBar;