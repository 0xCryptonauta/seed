import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface NavbarProps {
  onLogoClick?: () => void;
}

export function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 p-6">
          <div>
            <img
              src="/IB_icon.png"
              alt="IB Logo"
              className="w-6 h-6 cursor-pointer"
              onClick={onLogoClick}
            />
          </div>
          <div>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Deterministic Mnemonic Generator
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
