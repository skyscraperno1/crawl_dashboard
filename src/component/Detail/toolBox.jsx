import { Button } from "antd";
function ToolBox({t, showMore, loadMore}) {
  return <div className="absolute py-2 px-4 w-20 h-10 z-50">
    <Button onClick={loadMore.bind(null)} className={showMore ? 'inline-block' : 'hidden'} type="primary">{t('more')}</Button>
  </div>;
}

export default ToolBox;
