import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { moon, sun } from "../common/svg";
import localStorageService from "./../service/localStorage.service";

const ThemeButtons = () => {
  const [themeIsDark, setThemeIsDark] = useState(false);
  const element = document.documentElement;

  useEffect(() => {
    theme();
  }, []);

  function theme() {
    if (localStorageService.getTheme() === "dark") {
      setThemeIsDark(true);
    } else if (localStorageService.getTheme() === "light") {
      setThemeIsDark(false);
    }
  }

  useEffect(() => {
    themeIsDark
      ? element.classList.add("dark")
      : element.classList.remove("dark");
  }, [themeIsDark]);

  const handleClick = () => {
    themeIsDark
      ? localStorageService.setTheme("light")
      : localStorageService.setTheme("dark");

    theme();
  };

  return (
    <div className="fixed right-8 mt-5 bg-white dark:bg-[#40444b] dark:text-slate-300  md:w-16 w-14 rounded-xl pl-1 pt-1">
      <button onClick={handleClick}>{sun(themeIsDark)}</button>

      <button onClick={handleClick}>{moon(themeIsDark)}</button>
    </div>
  );
};

export default ThemeButtons;
