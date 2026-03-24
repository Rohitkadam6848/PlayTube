import React, { useState } from "react";

function Description({ text }) {
  const [extpanded, setExtpanded] = useState(false);

  const showButton = text?.length > 100;
  return (
    <div>
      <p
        className={`text-sm text-gray-300 whitespace-pre-line ${extpanded ? "" : "line-clamp-1"}`}
      >
        {text}
      </p>
      {showButton && (
        <button
          className="text-xs text-blue-400 mt-1 hover:underline"
          onClick={() => setExtpanded(!extpanded)}
        >
          {extpanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  );
}

export default Description;
