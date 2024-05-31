import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
interface user {
  name: string;
  email: string;
  photo: string;
}
interface cool {
  change: boolean;
  setC: Dispatch<SetStateAction<boolean>>;
  info: user | null;
}
export const con = createContext<cool | null>(null);
const Contextt = ({ children }: any) => {
  const [change, setC] = useState(false);
  const [info, setI] = useState<user | null>(null);
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/info", {
          withCredentials: true,
        });
        console.log(res.data);
        setI({
          name: res.data.name,
          email: res.data.email,
          photo: res.data.photo,
        });
      } catch (err) {
        console.log(err);
      }
    };
    getInfo();
  }, [change]);
  return <con.Provider value={{ change, setC, info }}>{children}</con.Provider>;
};

export default Contextt;
