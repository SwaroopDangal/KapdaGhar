import AddItem from "@/components/AddItem";
import ListItem from "@/components/ListItem";
import Orders from "@/components/Orders";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("add");

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddItem />;
      case "list":
        return <ListItem />;
      case "orders":
        return <Orders />;
      default:
        return <AddItem />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">{renderContent()}</main>
    </div>
  );
}
