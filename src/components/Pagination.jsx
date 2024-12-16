import React, { useEffect, useState } from "react";
import { MdArrowLeft } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";

function Pagination(props) {
  const page = props.page;
  const totalCount = props.totalPages;
  const totalPages = props.totalPages;
  const setPage = props.setPage;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArray, setCurrentPageArray] = useState(10);

  const handleNextButton = () => {
    currentPage <= totalCount && setCurrentPage(currentPage + 1);
    // setCurrentPageArray(Math.ceil(currentPage / 10) * 10 - 10);
  };

  const handlePrevButton = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPageArray(Math.ceil(currentPage / 10) * 10 - 10);
    setPage(currentPage);
  }, [currentPage, setPage]);

  return (
    <>
      <div className="flex gap-1 text-sm h-fit items-center text-blue-950">
        {/* {currentPage} -{Math.ceil(currentPage / 10) * 10 - 10}-{" "} */}
        {/* {currentPageArray} */}
        {/* {currentPage} {Math.ceil(currentPage / 10) * 10} */}
        {/* {currentPageArray} */}
        <button
          className={`h-8 px-1 py-1 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          title="Previous Page"
          onClick={handlePrevButton}
          disabled={currentPage <= 1 ? true : false}
        >
          <MdArrowLeft className="text-2xl" />
        </button>

        {currentPageArray > 0 && (
          <button
            className={`h-8 px-3 py-1 rounded border border-gray-200 hover:bg-gray-200`}
            title="Page 1"
            onClick={() => setCurrentPage(1)}
            // disabled={currentPage <= 1 ? true : false}
          >
            1
          </button>
        )}

        {currentPageArray > 0 && (
          <button
            className={`h-8 px-1 py-1 rounded border border-gray-200 hover:bg-gray-200`}
            title={`Pages ${currentPageArray - 9} - ${currentPageArray}`}
            onClick={() => setCurrentPageArray(currentPageArray - 10)}
            // disabled={page == 1 ? true : false}
          >
            {`${currentPageArray - 9} ... ${currentPageArray}`}
          </button>
        )}
        {[...Array(10)].map((_, index) => {
          const pageSeq = currentPageArray + index + 1;
          return (
            pageSeq <= totalCount && (
              <button
                key={index}
                className={`h-8 px-3 py-1 rounded border border-gray-200  ${
                  currentPage == pageSeq
                    ? "bg-blue-950 text-blue-50"
                    : "hover:bg-gray-200"
                }`}
                title={`Page ${pageSeq}`}
                onClick={() => setCurrentPage(pageSeq)}
                // disabled={page == pageSeq ? true : false}
              >
                {pageSeq}
              </button>
            )
          );
        })}

        {currentPageArray + 10 < totalCount && (
          <>
            <button
              className={`h-8 px-3 py-1 rounded border border-gray-200 hover:bg-gray-200`}
              title={`Pages ${currentPageArray + 11} - ${
                currentPageArray + 20
              }`}
              onClick={() => setCurrentPageArray(currentPageArray + 10)}
              // disabled={page == 1 ? true : false}
            >
              {`${currentPageArray + 11} ... ${currentPageArray + 20}`}
            </button>

            <button
              className={`h-8 px-3 py-1 rounded border border-gray-200 hover:bg-gray-200`}
              title="Last Page"
              onClick={() => setCurrentPage(totalCount)}
              disabled={page == totalCount ? true : false}
            >
              {totalCount}
            </button>
          </>
        )}

        {/* <div className="h-fit px-3 py-1">... {totalCount}</div> */}
        <button
          className={`h-8 px-1 py-1 rounded border border-gray-200 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed ${
            currentPage != totalPages ? "hover:bg-blue-100" : "bg-gray-200"
          }`}
          title="Next Page"
          onClick={handleNextButton}
          disabled={currentPage >= totalCount ? true : false}
        >
          <MdArrowRight className="text-2xl" />
        </button>
      </div>
    </>
  );
}

export default Pagination;
