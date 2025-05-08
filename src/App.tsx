import { useEffect, useState } from "react";

import type { HourFormat, Language } from ".";
import { StaticCalendar } from ".";
import { Label } from "./components/ui/label";

export default function App() {
  const { toggleTheme, theme } = useThemeToggle();
  const [selectedLang, setSelectLang] = useState<Language>("ne");
  const [selectedHourFormat, setSelectedHourFormat] =
    useState<HourFormat>("12");

  return (
    <div className="nedt:p-4 nedt:min-h-screen">
      <div className="nedt:flex nedt:flex-col nedt:md:flex-row nedt:gap-8 nedt:mt-4 nedt:md:mt-6">
        <div>
          <Label htmlFor="lang" className="nedt:mr-2 nedt:inline">
            Choose Language
          </Label>

          <select
            className="nedt:py-2 nedt:px-4 nedt:text-lg nedt:bg-white nedt:border nedt:border-gray-300 nedt:rounded-md nedt:shadow-sm nedt:focus:outline-none nedt:focus:ring-1 nedt:focus:ring-blue-500 nedt:appearance-none nedt:w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label htmlFor="hour-format" className="nedt:text-lg nedt:mr-2">
            Choose Hour Format
          </label>
          <select
            className="nedt:py-2 nedt:px-4 nedt:text-lg nedt:bg-white nedt:border nedt:border-gray-300 nedt:rounded-md nedt:shadow-sm nedt:focus:outline-none nedt:focus:ring-1 nedt:focus:ring-blue-500 nedt:appearance-none nedt:w-fit"
            defaultValue={selectedHourFormat}
            onChange={(e) =>
              setSelectedHourFormat(e.target.value as unknown as HourFormat)
            }
          >
            <option value={"12"}>12</option>
            <option value={"24"}>24</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="nedt:text-lg nedt:mr-2">
            Choose Theme
          </label>
          <select
            className="nedt:py-2 nedt:px-4 nedt:text-lg nedt:bg-white nedt:border nedt:border-gray-300 nedt:rounded-md nedt:shadow-sm nedt:focus:outline-none nedt:focus:ring-1 nedt:focus:ring-blue-500 nedt:appearance-none nedt:w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="nedt:flex nedt:flex-col nedt:max-w-lg nedt:mt-4 nedt:md:mt-6">
        <div className="nedt:mb-8">
          <label htmlFor="static-calendar" className="nedt:text-lg">
            Static Calendar
          </label>

          <StaticCalendar lang={selectedLang} />
        </div>
      </div>
    </div>
  );
}

function useThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  const handleOnToggleTheme = (theme: string) => {
    if (theme === "dark") {
      //document.documentElement.classList.add('nedt:dark')
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
    } else {
      //document.documentElement.classList.remove('nedt:dark')
      document.documentElement.setAttribute("data-theme", "light");

      setTheme("light");
    }
    localStorage.theme = theme;
  };

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      //document.documentElement.classList.add('nedt:dark')
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.theme = "dark";
      setTheme("dark");
    } else {
      //document.documentElement.classList.remove('nedt:dark')
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.theme = "light";
      setTheme("light");
    }
  }, []);

  return {
    toggleTheme: handleOnToggleTheme,
    theme,
  };
}
