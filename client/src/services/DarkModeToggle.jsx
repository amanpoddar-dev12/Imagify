import { Moon, Sun } from "lucide-react"; // or any other icon lib
import useDarkMode from "../hooks/usedarkmode";

const DarkModeToggle = () => {
  const [enabled, setEnabled] = useDarkMode();

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="p-2 rounded-full   transition"
    >
      {enabled ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className="text-gray-800" />
      )}
    </button>
  );
};

export default DarkModeToggle;
