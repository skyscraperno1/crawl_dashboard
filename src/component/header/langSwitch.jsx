import { useTranslation } from "react-i18next";
function Switcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const changeLanguage = () => {
    console.log(i18n.language)
    if (currentLang === 'zh') {
      i18n.changeLanguage('en');
    } else if (currentLang === 'en'){
      i18n.changeLanguage('zh');
    }
  };
  return (
    <div
      className="w-8 h-8 hover:bg-[#ffffff3d] rounded-md"
      onClick={changeLanguage.bind(null)}
    >
      <div className="select-none cursor-pointer relative font-text">
        <span className="rounded-sm z-10 left-[3px] top-[3px] absolute text-xs w-4 bg-themeColor text-center font-semibold text-text">
          {currentLang === 'zh' ? '中' : 'En'}
        </span>
        <span className="rounded-sm absolute left-[11px] top-[11px] text-xs bg-text text-themeColor w-4 text-center font-semibold">
          {currentLang === 'en' ? '中' : 'En'}
        </span>
      </div>
    </div>
  );
}

export default Switcher;
