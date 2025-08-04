import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "./../../../../../service/GlobalApi";

const Experience = () => {
  const [experienceList, setExperienceList] = useState([]);
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(resumeInfo?.Experience)) {
      setExperienceList(resumeInfo.Experience);
    } else {
      setExperienceList([]);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...experienceList];
    newEntries[index][name] = value;
    setExperienceList(newEntries);

    // 🔧 Live update context for preview
    setResumeInfo((prev) => ({
      ...prev,
      Experience: newEntries,
    }));
  };

  const handleRichTextEditor = (e, name, index) => {
    const newEntries = [...experienceList];
    newEntries[index][name] = e.target.value;
    setExperienceList(newEntries);

    // 🔧 Update context on summary change too
    setResumeInfo((prev) => ({
      ...prev,
      Experience: newEntries,
    }));
  };

  const AddNewExperience = () => {
    const updatedList = [
      ...experienceList,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummery: "",
      },
    ];
    setExperienceList(updatedList);
    setResumeInfo((prev) => ({
      ...prev,
      Experience: updatedList,
    }));
  };

  const RemoveExperience = () => {
    const updatedList = experienceList.slice(0, -1);
    setExperienceList(updatedList);
    setResumeInfo((prev) => ({
      ...prev,
      Experience: updatedList,
    }));
  };

  const onSave = () => {
    setLoading(true);

    const data = {
      data: {
        Experience: experienceList,
      },
    };

    GlobalApi.UpdateResumeDetail(params?.resumeID, data)
      .then((res) => {
        setLoading(false);
        toast("Details updated!");
        setResumeInfo((prev) => ({
          ...prev,
          Experience: experienceList,
        }));
      })
      .catch(() => {
        setLoading(false);
        toast.error("Something went wrong!");
      });
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add Your Previous Job experience</p>

        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs"> Position Title </label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.title}
                  />
                </div>
                <div>
                  <label className="text-xs"> Company Name </label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.companyName}
                  />
                </div>
                <div>
                  <label className="text-xs"> City </label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.city}
                  />
                </div>
                <div>
                  <label className="text-xs"> State </label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.state}
                  />
                </div>
                <div>
                  <label className="text-xs"> Start Date </label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.startDate}
                  />
                </div>
                <div>
                  <label className="text-xs"> End Date </label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.endDate}
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    defaultValue={item?.workSummery}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummery", index)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewExperience}
              className="text-primary"
            >
              + Add More Experience
            </Button>
            <Button
              variant="outline"
              onClick={RemoveExperience}
              className="text-primary"
              disabled={experienceList.length === 0}
            >
              - Remove
            </Button>
          </div>

          <Button disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Experience;
