import { useTranslation } from 'react-i18next'
const HeaderMenu = ({ menuList }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col bg-boardBg py-2 text-center shadow-xl rounded-lg">
      {menuList.map((it) => {
        return (
          <a
            key={it.path}
            href={it.path}
            className="cursor-pointer text-sm text-text hover:bg-[#ffffff20] px-3"
          >
            {t(it.text)}
          </a>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
