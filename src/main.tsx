import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Create from "./pages/form/create.tsx";
import "./globals.css";
import View from "./pages/form/view.tsx";
import Home from "./pages/home.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/Login.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
       
          <Route index element={<LoginPage />} />
          <Route path="/form/create" element={<Create />} />
          <Route path="/form/list" element={<Home />} />
          <Route path="/form/view/:formId" element={<View />} />
          <Route path="form/update/:formId" element={<Create />} />
   
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
