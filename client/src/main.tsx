import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ThemeProvider defaultTheme="dark" storageKey="guru-gyan-theme">
    <App />
    <Toaster />
  </ThemeProvider>
);
