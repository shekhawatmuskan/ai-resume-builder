import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/Dashboard/resume/components/ResumePreview";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as GlobalApi from "./../../../../service/GlobalApi";
import { RWebShare } from "react-web-share";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const [loading, setLoading] = useState(false);
  const { resumeId } = useParams();

  useEffect(() => {
    GetResumeInfo();
  }, [resumeId]);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((resp) => {
      if (resp.data.data && resp.data.data.length > 0) {
        const data = resp.data.data[0];
        // Flatten Strapi v4 response if attributes exist
        const flattenedData = data.attributes ? { id: data.id, ...data.attributes } : data;
        setResumeInfo(flattenedData);
      }
    });
  };

  const generatePDF = async () => {
    const element = document.getElementById("print-area");
    // Ensure the element is visible and has a standard width for A4 ratio
    const originalStyle = element.style.cssText;
    element.style.width = "794px"; // Standard A4 width at 96 DPI
    element.style.padding = "20px";
    element.style.boxShadow = "none";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 794,
    });

    element.style.cssText = originalStyle; // Restore original style

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Center and fill width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    return { pdf, pdfBlob: pdf.output("blob") };
  };

  const HandleDownload = async () => {
    setLoading(true);
    try {
      const { pdf } = await generatePDF();
      pdf.save(`${resumeInfo?.firstName}_${resumeInfo?.lastName}_Resume.pdf`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const HandleShare = async () => {
    setLoading(true);
    try {
      const { pdfBlob } = await generatePDF();
      const fileName = `${resumeInfo?.firstName}_${resumeInfo?.lastName}_Resume.pdf`;
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Here is the resume of ${resumeInfo?.firstName} ${resumeInfo?.lastName}`,
        });
      } else {
        // Fallback for browsers that don't support file sharing
        toast("File sharing not supported in this browser. You can download and share manually.");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI generates Resume is ready !{" "}
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and you can share unique
            resume url with your friends and family{" "}
          </p>
          <div className="flex justify-between px-44 my-10">
            <Button onClick={HandleDownload} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Download"}
            </Button>

            <Button onClick={HandleShare} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Share"}
            </Button>
          </div>
        </div>
      </div>
      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
