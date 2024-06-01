import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "@radix-ui/react-icons";

const History = () => {
  const [data, setD] = useState<any[]>([]);
  const [change, setC] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      toast("fetching history");
      try {
        const res = await axios.get(
          "https://calendar-9ofe.onrender.com/history",
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        toast.success("history's data fetched successfully");
        setD(res.data);
      } catch (err) {
        console.log(err);
        toast.error("something went wrong file fetching user's history");
      }
    };
    getData();
  }, [change]);
  return (
    <div className="min-h-[80dvh]">
      <Table>
        <TableCaption>
          Histories of operation done throught our app.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Event_Id</TableHead>
            <TableHead>Executed At</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((ele, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{ele.event}</TableCell>
                <TableCell>{ele.event_id}</TableCell>
                <TableCell>{ele.executedAt}</TableCell>
                <TableCell className="text-right">
                  <TrashIcon
                    className="cursor-pointer"
                    onClick={async (e) => {
                      e.preventDefault();
                      toast("Deleting history")
                      try {
                        const res = await axios.delete(
                          `https://calendar-9ofe.onrender.com/history/:${ele._id}`
                        );
                        console.log(res.data);
                        setC(!change);
                        toast.success("History Deleted Successfully");
                      } catch (err) {
                        console.log(err);
                        toast.error("something went wrong");
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;
