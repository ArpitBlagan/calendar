import { useEffect } from "react";
import toast from "react-hot-toast";

const Intro = () => {
  useEffect(() => {
    toast.success("welcome to the app");
  }, []);
  return (
    <div className="flex justify-center items-center min-h-[80dvh]">
      <p className="text-[40px] text-gray-600 py-2 px-3 rounded-xl border border-gray-300">
        A Calendar CRUD (Create, Read, Update, Delete) application integrated
        with Google Calendar.
        <br />
        Offers a powerful solution to manage your schedule seamlessly.
      </p>
    </div>
  );
};

export default Intro;
