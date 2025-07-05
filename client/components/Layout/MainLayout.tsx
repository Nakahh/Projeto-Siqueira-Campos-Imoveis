import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { ChatWidget } from "../Chat/ChatWidget";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showChat?: boolean;
}

export function MainLayout({
  children,
  showSidebar = false,
  showChat = true,
}: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {showSidebar && user && <Sidebar />}

        <main className={`flex-1 ${showSidebar ? "ml-64" : ""}`}>
          {children}
        </main>
      </div>

      <Footer />

      {showChat && <ChatWidget />}
    </div>
  );
}
