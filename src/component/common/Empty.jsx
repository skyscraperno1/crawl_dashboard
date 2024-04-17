import img from '../../assets/empty.png'
function Empty({description, t}) {
  const desc = description ? description : t('empty')
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <img alt="" src={img} className='h-[150px]'/> 
      <p className="text-text pt-4">{desc}</p>
    </div>
  )
}
export default Empty