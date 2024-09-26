import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import ResumeCardItem from "./components/ResumeCardItem";

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      GetResumeList(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  /**
   * to get user resume list
   */

  const GetResumeList = (email) => {
    GlobalApi.GetUserResumes(email)
      .then((resp) => {
        setResumeList(resp.data.data);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  };

  return (
    <div className="p-10 md:px-20 lg:px-32 ">
      <h2 className="font-bold text-3xl ">My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-5 mt-10 ">
        <AddResume />
        {resumeList.length > 0 &&
          resumeList.map((resume, index) => (
            <ResumeCardItem resume={resume} key={index} />
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
