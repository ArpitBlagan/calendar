import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { formatISO } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
//   'start': {
//     'dateTime': '2015-05-28T09:00:00-07:00',
//     'timeZone': 'Asia/Kolkata',
//   }
const eventInsert = z.object({
  summary: z.string().nonempty("Summary is required"),
  description: z.string().nonempty("Description is required"),
  attendees: z.string().nonempty("Attendees are required"),
  dateTime: z.string().nonempty("Date and Time are required"),
  endTime: z.string().nonempty("Date and Time are required"),
});
type eventType = z.infer<typeof eventInsert>;
const Form = ({ setChange, change }: any) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startDatee, setStartDatee] = useState<Date | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<eventType>({
    resolver: zodResolver(eventInsert),
  });
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      const formattedDate = formatISO(date);
      console.log(formattedDate);
      setValue("dateTime", formattedDate);
    }
  };
  const handleDateChangee = (date: Date | null) => {
    setStartDatee(date);
    if (date) {
      const formattedDate = formatISO(date);
      console.log(formattedDate);
      setValue("endTime", formattedDate);
    }
  };
  const submit: SubmitHandler<eventType> = async (data) => {
    console.log("login", data);
    const ff = data.attendees.split(",");
    try {
      const body = {
        summary: data.summary,
        description: data.description,
        attendees: ff,
        dateTime: data.dateTime,
        endTime: data.endTime,
      };
      const res = await axios.post(
        "https://calendar-9ofe.onrender.com/event",
        body,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      toast.success("event created successfully");
      setChange(!change);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong while creating a new event");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
        <div className="flex flex-col items-start ">
          <label>Summary</label>
          <Input
            {...register("summary")}
            placeholder="Final interview round."
          />
          {errors.summary && (
            <p className="text-red-300 ">{errors.summary.message}</p>
          )}
        </div>
        <div className="flex flex-col items-start">
          <label>Description</label>
          <Input
            {...register("description")}
            placeholder="Interview round of Arpit for Full stack role"
          />
          {errors.description && (
            <p className="text-red-300 ">{errors.description.message}</p>
          )}
        </div>
        <div className="flex flex-col items-start">
          <label>Attendess</label>
          <Input
            {...register("attendees")}
            placeholder="Write email ids separated with commans(,)"
          />
          {errors.attendees && (
            <p className="text-red-300 ">{errors.attendees.message}</p>
          )}
        </div>
        <div className="flex flex-col items-start">
          <label>startTime</label>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
            placeholderText="Select date and time"
          />
          {errors.dateTime && (
            <p className="text-red-300">{errors.dateTime.message}</p>
          )}
        </div>
        <div className="flex flex-col items-start">
          <label>endTime</label>
          <DatePicker
            selected={startDatee}
            onChange={handleDateChangee}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
            placeholderText="Select date and time"
          />
          {errors.endTime && (
            <p className="text-red-300">{errors.endTime.message}</p>
          )}
        </div>
        <div className="flex justify-center items-center w-full">
          <Button type="submit" variant={"destructive"}>
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
