import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { generateAIContent } from "./../../../../service/AIModal";
import { toast } from "sonner";
const EXPERIENCE_PROMPT =
  "job title: {jobTitle}, position title: {positionTitle}, Depends on the job and position title give me 5-7 bullet points for my experience in resume (Please do not add experience level and No JSON array), give me result in HTML tags";

const SUMMARY_PROMPT =
  "job title: {jobTitle}, Give me a professional summary for my resume in 4-5 lines (No JSON array), give me result in HTML tags";

function RichTextEditor({ onRichTextEditorChange, index, defaultValue, type = "experience" }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const GenerateSummeryFromAI = async () => {
    if (type === "experience" && !resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    if (type === "summary" && !resumeInfo?.jobTitle) {
      toast("Please Add Job Title first");
      return;
    }

    try {
      setLoading(true);

      const prompt = type === "experience"
        ? EXPERIENCE_PROMPT.replace("{jobTitle}", resumeInfo?.jobTitle || "")
          .replace("{positionTitle}", resumeInfo.experience[index].title)
        : SUMMARY_PROMPT.replace("{jobTitle}", resumeInfo?.jobTitle || "");

      const resp = await generateAIContent(prompt);
      console.log("AI Response:", resp);

      try {
        // If AI returns JSON (common with some models/prompts)
        const parsed = JSON.parse(resp);
        let finalVal = "";
        if (type === "experience") {
          const html = Array.isArray(parsed)
            ? parsed.map((item) => `<li>${item.bullet || item}</li>`).join("")
            : typeof parsed === "object"
              ? Object.values(parsed)
                .map((item) => `<li>${item}</li>`)
                .join("")
              : resp;
          finalVal = html.includes("<li>") ? `<ul>${html}</ul>` : html;
        } else {
          // For summary, if it's an object or array, just take the first string or join them
          finalVal = Array.isArray(parsed)
            ? parsed.map(item => item.summary || item).join(" ")
            : typeof parsed === "object"
              ? parsed.summary || Object.values(parsed)[0]
              : resp;
        }

        setValue(finalVal);
        onRichTextEditorChange({ target: { value: finalVal } });
      } catch (e) {
        // Clean up markdown if AI returned it despite instructions
        const cleanedResp = resp.replace(/```html|```/g, "").trim();
        setValue(cleanedResp);
        onRichTextEditorChange({ target: { value: cleanedResp } });
      }
    } catch (err) {
      console.error(err);
      toast("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">{type === "summary" ? "Professional Summary" : "Summary"}</label>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
