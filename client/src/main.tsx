// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
root.render(
  // <StrictMode>
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AnchoredToastProvider>
            <App />
          </AnchoredToastProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>,
  // </StrictMode>,
);
