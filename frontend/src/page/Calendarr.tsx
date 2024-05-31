import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Form from "@/components/Form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
const Calendarr = () => {
  const [loading, setL] = useState(true);
  const [change, setChange] = useState(false);
  const [data, setD] = useState<any[]>([]);
  const [events, setE] = useState([]);
  useEffect(() => {
    const getData = async () => {
      setL(true);
      try {
        const res = await axios.get("http://localhost:8000/events", {
          withCredentials: true,
        });
        console.log(res.data);
        const fff: any[] = [];
        res.data.map((ele: any) => {
          const ff = ele.start.dateTime;
          if (!ff) {
            return;
          }
          console.log(ff);
          const date = ff.split("T")[0];
          const time = ff.split("T")[1];
          console.log(time);
          fff.push({
            title: ele.description,
            id: ele.id as string,
            start: ele.start.dateTime,
            end: ele.end.dateTime,
          });
          return;
        });
        setD(fff);
        setE(res.data);
        setL(false);
        toast.success("successfully fetched the events detail");
      } catch (err) {
        toast.error("something went wrong while fetching event info");
        console.log(err);
        setL(false);
      }
    };
    getData();
  }, [change]);
  const handleDateClick = (arg: any) => {
    console.log("cool", arg.event._def.title);
  };
  return (
    <div>
      {loading ? (
        <div className="min-h-[80dvh] flex items-center justify-center">
          <LoadingIcons.Puff stroke="#000000" strokeOpacity={0.125} />
        </div>
      ) : (
        <div className="flex flex-col gap-3 my-2">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <p className="py-2 px-4 bg-red-400 rounded-xl">Add Event</p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Event</DialogTitle>
                  <DialogDescription>
                    <Form setChange={setChange} change={change} />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={data}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
          />
        </div>
      )}
    </div>
  );
};
function renderEventContent(eventInfo: any) {
  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <p className="text-red-300 w-full overflow-hidden">Event</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Operation on Event with id {eventInfo.event.id}
          </DialogTitle>
          <DialogDescription>
            <div>
              <p>{eventInfo.event?.title}</p>
            </div>
            <div className="flex items-center justify-around">
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await axios.delete(
                      `http://localhost:8000/events/:${eventInfo.event.id}`,
                      {
                        withCredentials: true,
                      }
                    );
                    toast.success("event deleted successfullly.");
                    console.log(res.data);
                  } catch (err) {
                    toast.error("something went wrong while deleting an event");
                    console.log(err);
                  }
                }}
                variant={"destructive"}
              >
                Delete
              </Button>
              <Button>Update</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default Calendarr;
