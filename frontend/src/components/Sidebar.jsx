import React, { useState } from "react";
import { PlusCircle, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      key: "add",
      label: "Add Items",
      icon: <PlusCircle className="w-4 h-4 mr-2" />,
    },
    {
      key: "list",
      label: "List Items",
      icon: <List className="w-4 h-4 mr-2" />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingCart className="w-4 h-4 mr-2" />,
    },
  ];

  const renderSidebar = (isMobile = false) => (
    <aside
      className={`${
        isMobile
          ? "fixed left-0 top-0 w-16 flex flex-col justify-start bg-gradient-to-b from-purple-700 via-purple-600 to-purple-500 border-r border-gray-700/50 p-2 md:hidden min-h-screen z-50"
          : "w-72 bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 p-6 border-r border-gray-700/50 min-h-screen hidden md:flex flex-col backdrop-blur-xl"
      }`}
    >
      {!isMobile && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-2">Manage your store</p>
        </div>
      )}

      <div
        className={`flex ${
          isMobile ? "flex-col space-y-3 mt-4" : "flex-col space-y-3"
        }`}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className={`flex items-center transition-all duration-300 ${
              isMobile
                ? "justify-center p-3 w-12 h-12"
                : "justify-start p-4 rounded-xl"
            } ${
              activeTab === tab.key
                ? "bg-white/20 text-white border border-white/30 shadow-lg transform scale-105"
                : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {React.cloneElement(tab.icon, {
              className: `${isMobile ? "w-6 h-6" : "w-5 h-5 mr-3"} ${
                activeTab === tab.key ? "text-white" : ""
              }`,
            })}
            {!isMobile && <span className="font-medium">{tab.label}</span>}
          </Button>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      {renderSidebar()}
      {renderSidebar(true)}
    </>
  );
};

export default Sidebar;
