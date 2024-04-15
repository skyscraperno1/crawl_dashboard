import PropTypes from 'prop-types';
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayPages = 8,
}) {
  const maxDisplay = Math.max(5, Number(maxDisplayPages));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  function getDisplayPage() {
    if (totalPages <= maxDisplay) {
      return pageNumbers;
    } else {
      if (currentPage <= Math.floor(maxDisplay / 2)) {
        return [
          ...pageNumbers.slice(0, maxDisplay - 2),
          "...",
          totalPages,
        ];
      } else if (currentPage >= totalPages - Math.floor(maxDisplay / 2)) {
        return [1, "...", ...pageNumbers.slice(-maxDisplay + 2)];
      } else {
        const startPage = currentPage - Math.floor((maxDisplay - 3) / 2);
        const endPage = currentPage + Math.floor((maxDisplay - 4) / 2);
        return [
          1,
          "...",
          ...pageNumbers.slice(startPage, endPage),
          "...",
          totalPages,
        ];
      }
    }
  }
  const displayPages = getDisplayPage();
  const toPage = (type) => {
    if (type === "prev" && currentPage !== 1) {
      onPageChange(currentPage - 1);
    } else if (type === "next" && currentPage !== totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const handlePageClick = (pageNumber, index) => {
    if (pageNumber === "...") {
      const diff = Math.floor(
        (displayPages[index + 1] - displayPages[index - 1]) / 2
      );
      if (index === 1) {
        onPageChange(displayPages[index + 1] - diff);
      } else if (index === maxDisplay - 2) {
        onPageChange(displayPages[index - 1] + diff);
      }
    } else {
      onPageChange(pageNumber);
    }
  };

  const disabled = {
    cursor: "not-allowed",
    opacity: 0.5,
  };
  return (
    <div>
      <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
        <ol className="flex justify-end gap-1 text-xs font-medium">
          <li>
            <div
              style={currentPage === 1 ? disabled : {}}
              onClick={() => {
                toPage("prev");
              }}
              className="cursor-pointer inline-flex size-8 items-center justify-center rounded border border-text/30 bg-[#262727] text-text rtl:rotate-180 hover:text-themeColor"
            >
              <span className="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </li>
          {displayPages.map((pageNumber, idx) => (
            <li key={idx}>
              <button
                className={`block size-8 rounded border border-gray-100text-center leading-8  ${
                  pageNumber === currentPage
                    ? "border-themeColor bg-themeColor text-white"
                    : "border-text/30 bg-[#262727] text-text hover:text-themeColor"
                }`}
                onClick={() => handlePageClick(pageNumber, idx)}
              >
                {pageNumber}
              </button>
            </li>
          ))}

          <li>
            <div
              onClick={() => {
                toPage("next");
              }}
              style={currentPage === totalPages ? disabled : {}}
              className="cursor-pointer inline-flex size-8 items-center justify-center rounded border border-text/30 bg-[#262727] text-text rtl:rotate-180 hover:text-themeColor"
            >
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  numberProp: PropTypes.number,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number
}

export default Pagination;
