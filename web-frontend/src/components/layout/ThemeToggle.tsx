import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleDarkMode } from "../../store/uiSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.ui.darkMode);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => dispatch(toggleDarkMode())}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
