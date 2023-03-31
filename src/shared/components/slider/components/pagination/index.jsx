import React from "react";

function Pagination({ numSlides, active, onGoSlide }) {
  return (
    <ul className="pagination-dots">
      {Array(numSlides)
        .fill(0)
        .map((_, dotIndex) => {
          return (
            <span
              key={dotIndex}
              className={`dot ${active === dotIndex ? "active" : ""}`}
              onClick={() => onGoSlide(dotIndex)}
            />
          );
        })}
    </ul>
  );
}

export default Pagination;
