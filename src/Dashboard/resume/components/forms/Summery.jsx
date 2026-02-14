import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useParams } from "react-router-dom";
import * as GlobalApi from "./../../../../../service/GlobalApi";
import { Brain, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { generateAIContent } from "./../../../../../service/AIModal";

/* ---------- AI PROMPT TEMPLATE ---------- */
const PROMPT = `
Resume Title: {resumeTitle}
Job Title: {jobTitle}

Return ONLY valid JSON.
Give 3 professional resume summaries (4–5 lines each) for:
- Fresher
- Mid Level
- Senior Level

Format:
[
  {
    "experience_level": "",
    "summary": ""
  }
]
`;

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo?.summery || "");
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
  const { resumeId } = useParams();
  useEffect(() => {
    if (resumeInfo?.summery) {
      setSummery(resumeInfo?.summery);
    }
  }, []);

  /* ---------- Sync summary with context ---------- */
  const handleChange = (e) => {
    enabledNext(false);
    setSummery(e.target.value);
    setResumeInfo({
      ...resumeInfo,
      summery: e.target.value,
    });
  };

  /* ---------- Generate Summary from AI ---------- */
  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Please add Job Title first");
      return;
    }

    try {
      setLoading(true);

      const finalPrompt = PROMPT.replace("{jobTitle}", resumeInfo.jobTitle)
        .replace("{resumeTitle}", resumeInfo.title)
        .replace("{positionTitle}", resumeInfo.jobTitle);

      const text = await generateAIContent(finalPrompt);

      try {
        const parsed = JSON.parse(text);
        setAiGenerateSummeryList(parsed);
      } catch (parseError) {
        console.warn("JSON parsing failed, attempting fallback:", parseError);
        // Fallback: If AI returns a plain string, wrap it as a "Mid Level" summary
        setAiGenerateSummeryList([
          { experience_level: "Mid Level", summary: text }
        ]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Save Summary ---------- */
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ---------- Summary Form ---------- */}
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a professional summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={GenerateSummeryFromAI}
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate from AI
                </>
              )}
            </Button>
          </div>

          <RichTextEditor
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ---------- AI Suggestions ---------- */}
      {aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">AI Suggestions</h2>

          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enabledNext(false);
                setSummery(item.summary);
                setResumeInfo({
                  ...resumeInfo,
                  summery: item.summary,
                });
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:border-primary border"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item.experience_level}
              </h2>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;
