// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";

import "./index.css";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(
  // <StrictMode>
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <ToastProvider>
        <AnchoredToastProvider>
          <App />
        </AnchoredToastProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>,
  // </StrictMode>,
);
