import { ThemeProvider } from "@/components/theme-provider";

import viteLogo from "/vite.svg";

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";
import { SearchIcon } from "lucide-react";
import NavLink from "./components/link/link";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="bg-background min-h-screen w-full overflow-hidden flex flex-col">
        <nav className="animate__animated animate__slideInDown z-50 bg-background fixed w-full py-5 border-b border-slate-700">
          <div className="px-5 mx-auto max-w-[1468px] flex justify-between items-center">
            <Link className="" to="/dswd-counter">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </Link>
            <nav className="text-accent-foreground flex gap-10 uppercase items-center">
              <NavLink to="/dswd-counter/page1" text="HOME" />
              <NavLink to="/dswd-counter/page2" text="ABOUT US" />
              <NavLink to="/dswd-counter/contact" text="Contact Us" />
              <div className="bg-primary p-3 rounded-full hover:cursor-pointer">
                <SearchIcon className="text-accent w-5 h-5" />
              </div>
            </nav>
          </div>
        </nav>

        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
