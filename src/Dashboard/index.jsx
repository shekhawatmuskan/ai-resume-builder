import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/clerk-react";
import * as GlobalApi from "./../../service/GlobalApi.js";
import ResumeCardItem from "./components/ResumeCardItem";

function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      GetResumesList();
    }
  }, [user, isLoaded, isSignedIn]);

  /**
   * Used to Get Users Resume List
   */
  const GetResumesList = () => {
    setLoading(true);
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      setLoading(false);
      return;
    }

    GlobalApi.GetUserResumes(email)
      .then((resp) => {
        setResumeList(resp.data.data);
      })
      .catch((err) => {
        console.error("Fetch Resumes Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>
      <div
        className="grid grid-cols-2 
      md:grid-cols-3 lg:grid-cols-5 gap-5
      mt-10
      "
      >
        <AddResume isFirst={!loading && resumeList.length === 0} />
        {loading
          ? [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            ></div>
          ))
          : resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={index}
              refreshData={GetResumesList}
            />
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
