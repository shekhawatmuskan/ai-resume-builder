import React from "react";

function SummeryPreview({ resumeInfo }) {
  return (
    <div
      className="text-xs preview-list-container"
      dangerouslySetInnerHTML={{ __html: resumeInfo?.summery }}
    />
  );
}

export default SummeryPreview;
