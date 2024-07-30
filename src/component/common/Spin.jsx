function Spin({ color = "themeColor" }) {
  return (
    <div className="spin-wrapper w-full h-full flex items-center justify-center absolute z-50" style={{ backgroundColor: 'rgba(100, 100, 100, 0.5)' }}> {/* 修改了透明度为50% */}
      <div
        className={`text-${color} inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="sr-only"> {/* 使用 sr-only 来隐藏文本，使得加载指示器对屏幕阅读器可见 */}
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Spin;
