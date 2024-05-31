import { useContext } from "react";
import { con } from "@/Contextt";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link } from "react-router-dom";

const Navbar = () => {
  const value = useContext(con);
  return (
    <div className="rounded-xl flex items-center py-2  px-4 border border-gray-300">
      <Link
        to="/"
        className="font-mono bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text"
      >
        Calendarr
      </Link>
      <div className="flex-1 flex items-center justify-end gap-4">
        {!value?.info ? (
          <Link to="/login">Login</Link>
        ) : (
          <div className="flex gap-3 items-center ">
            <Link to="/calendar">View events</Link>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Profile</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <img
                      src={value.info.photo}
                      height={20}
                      width={20}
                      className="rounded-full"
                    />
                    <MenubarShortcut>{value.info.name}</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>{value.info.email}</MenubarItem>
                  <MenubarSeparator />
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
