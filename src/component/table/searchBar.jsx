import { Input } from "antd";
function SearchBar({onChange, t}) {
  return (
    <div className="h-[48px] w-full flex items-center px-4">
      <div className="w-[450px] flex justify-between items-center">
        <div className="label text-text mr-6 text-center w-[100px]">{t('address')}</div>
        <Input onBlur={(e) => {
          onChange(e.target.value)
        }} 
          allowClear={true} 
          onChange={(e) => {
            if (!e.target.value) {
              onChange('')
            }
          }}
        ></Input>
      </div>
    </div>
  );
}

export default SearchBar;