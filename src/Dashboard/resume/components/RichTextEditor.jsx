import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
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
const PROMPT =
  "job title: {jobTitle}, position title: {positionTitle}, Depends on the job and position title give me 5-7 bullet points for my experience in resume (Please do not add experience level and No JSON array), give me result in HTML tags";
function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }

    try {
      setLoading(true);

      const prompt = PROMPT.replace("{jobTitle}", resumeInfo?.jobTitle)
        .replace("{positionTitle}", resumeInfo.experience[index].title);

      const resp = await generateAIContent(prompt);

      try {
        // If AI returns JSON (common with some models/prompts)
        const parsed = JSON.parse(resp);
        const html = Array.isArray(parsed)
          ? parsed.map((item) => `<li>${item.bullet || item}</li>`).join("")
          : typeof parsed === "object"
            ? Object.values(parsed)
              .map((item) => `<li>${item}</li>`)
              .join("")
            : resp;
        setValue(html.includes("<li>") ? `<ul>${html}</ul>` : html);
      } catch (e) {
        // If it's already HTML or just text
        setValue(resp);
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
        <label className="text-xs">Summery</label>
        <Button
          variant="outline"
          size="sm"
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
