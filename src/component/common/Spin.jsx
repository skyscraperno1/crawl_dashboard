function Spin({ color = "themeColor" }) {
  return (
    <div className="spin-wrapper w-full h-full flex items-center justify-center absolute z-[999]" style={{backgroundColor: 'rgb(57 57 57 / 80%)'}}>
      <div
        className={`text-${color} inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]  motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Spin;
