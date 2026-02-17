import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useParams } from "react-router-dom";
import * as GlobalApi from "./../../../../../service/GlobalApi";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";


function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo?.summery || "");
  const [isSaving, setIsSaving] = useState(false);
  const { resumeId } = useParams();
  useEffect(() => {
    if (resumeInfo?.summery) {
      setSummery(resumeInfo?.summery);
    }
  }, []);


  /* ---------- Save Summary ---------- */
  const onSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = {
      summery,
    };

    try {
      await GlobalApi.UpdateResumeDetail(resumeId, data);
      enabledNext(true);
      toast.success("Details updated");
    } catch (err) {
      console.error(err);
      toast("Failed to save details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* ---------- Summary Form ---------- */}
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a professional summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <RichTextEditor
            type="summary"
            defaultValue={summery}
            onRichTextEditorChange={(e) => {
              const val = e.target.value;
              setSummery(val);
              setResumeInfo({
                ...resumeInfo,
                summery: val,
              });
            }}
          />

          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <LoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Summery;
