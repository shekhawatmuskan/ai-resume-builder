import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../service/GlobalApi";
import { toast } from "sonner";

function ThemeColor() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFA1",
    "#FF7133",
    "#71FF33",
    "#7133FF",
    "#FF3371",
    "#33FF71",
    "#3371FF",
    "#A1FF33",
    "#33A1FF",
    "#FF5733",
    "#5733FF",
    "#33FF5A",
    "#5A33FF",
    "#FF335A",
    "#335AFF",
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState(
    resumeInfo?.themeColor || ""
  );
  const { resumeId } = useParams();

  const isUpdating = useRef(false);

  const onColorSelect = async (color) => {
    if (color === selectedColor || isUpdating.current) return;

    isUpdating.current = true;
    setSelectedColor(color);

    // Only update context if different
    if (resumeInfo?.themeColor !== color) {
      setResumeInfo((prev) => ({
        ...prev,
        themeColor: color,
      }));
    }

    const data = { data: { themeColor: color } };
    try {
      await GlobalApi.UpdateResumeDetail(resumeId, data);
      toast("Theme Color Updated!");
    } catch (err) {
      console.error("Error updating theme color", err);
      toast.error("Failed to update theme.");
    } finally {
      setTimeout(() => {
        isUpdating.current = false;
      }, 300);
    }
  };

  useEffect(() => {
    if (!resumeInfo?.themeColor) return;

    if (resumeInfo.themeColor !== selectedColor) {
      setSelectedColor(resumeInfo.themeColor);
    }
  }, [resumeInfo?.themeColor]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer 
                ${selectedColor === item ? "border-2 border-black" : "border"} 
                hover:border-black`}
              style={{ background: item }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
