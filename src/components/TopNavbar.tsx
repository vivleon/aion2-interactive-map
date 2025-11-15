import React, { useState } from "react";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import LanguageSwitcher from "./LanguageSwitcher";

const TopNavbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);

    if (newState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="w-full h-14 flex items-center justify-end px-4 border-b border-default-200 bg-content1/80 backdrop-blur-md gap-4">

      {/* Language switcher (icon dropdown) */}
      <LanguageSwitcher />

      {/* Dark mode toggle */}
      <Button isIconOnly variant="light" onPress={toggleDarkMode}>
        <FontAwesomeIcon
          icon={darkMode ? faSun : faMoon}
          className="text-xl"
        />
      </Button>
    </div>
  );
};

export default TopNavbar;