import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";

const formField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: "",
};
function Experience() {
  const [experienceList, setExperienceList] = useState([
    {
      formField,
    },
  ]);

  const handleChange = (index, event) => {};

  const AddNewExperience = () => {
    setExperienceList([...experienceList, formField]);
  };

  const RemoveExperience = () => {
    setExperienceList((experienceList) => [...experienceList.slice(0, -1)]);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add Your Previous Job experience</p>
        <div>
          {experienceList.map((item, index) => (
            <div>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs"> Position Title </label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label className="text-xs"> Company Name </label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label className="text-xs"> City </label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label className="text-xs"> State</label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label className="text-xs"> Start Date </label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label className="text-xs"> End Date </label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div className="col-span-2">
                  {/* Work Summery */}
                  <RichTextEditor />
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
            >
              - Remove
            </Button>
          </div>

          <Button>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
