import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext } from "react";

function ResumePreview() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  return (
    <div>
      {/**Personal Detail */}

      {/**Summery */}

      {/**Professional Experience */}

      {/** Educational */}

      {/** Skills */}
    </div>
  );
}

export default ResumePreview;
