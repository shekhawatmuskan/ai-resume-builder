
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import * as GlobalApi from "./../../../../../service/GlobalApi";

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      GetResumeInfo();
    }
  }, [resumeId]);

  const GetResumeInfo = async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.GetResumeById(resumeId);

      // Strapi returns array even for single record
      const data = resp.data.data[0];
      // Flatten Strapi v4 response if attributes exist
      const flattenedData = data.attributes ? { id: data.id, ...data.attributes } : data;
      setResumeInfo(flattenedData);
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading resume...</div>;
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        {/* Form Section */}
        <FormSection />

        {/* Preview Section */}
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
