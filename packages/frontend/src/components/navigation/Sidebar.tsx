"use JSX";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  GraduationCap,
  Plus,
  LayoutDashboard,
  Sliders,
  FolderHeart,
  Library,
  Settings,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  avatarUrl?: string;
  schoolName?: string;
  location?: string;
}

export default function Sidebar({
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  schoolName: explicitSchoolName,
  location: explicitLocation,
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state toggle track
  
  const storeSettings = useSettingsStore();
  const activeSchoolName = explicitSchoolName || storeSettings.schoolName || "Delhi Public School";
  const activeLocationSub = explicitLocation || storeSettings.departmentName || "General Faculty";

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Paper Patterns", href: "/patterns", icon: Sliders },
    { label: "Context Vault", href: "/vault", icon: FolderHeart }, 
    { label: "My Library", href: "/library", icon: Library },
  ];

  const NavContent = () => (
    <>
      <div className="space-y-6">
        {/* Brand Identity Logo Row */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900">
            Assessment<span className="text-slate-900">AI</span>
          </span>
        </div>

        {/* Create Assignment Button Wrapper */}
        <Link
          href="/create"
          onClick={() => setIsOpen(false)}
          className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] border border-blue-600 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-3 text-white" /> 
          <span className="text-white">Create Assignment</span>
        </Link>

        {/* Navigation Link Stack */}
        <nav className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-slate-900" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 mt-auto pt-6">
        {/* Settings Navigation Link */}
        <Link
          href="/settings"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
            pathname === "/settings"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Settings className="h-5 w-5 text-slate-400" />
          <span>Settings(Beta)</span>
        </Link>

        {/* Divider Separation Line */}
        <div className="h-px bg-slate-100 mx-2" />

        {/* School Profile Context Block */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
          <img
            src={avatarUrl}
            alt={storeSettings.teacherName || "Lead Educator"}
            className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-slate-900 truncate tracking-wide">
              {storeSettings.teacherName || "Lead Educator"}
            </h4>
            <p className="text-[10px] font-bold text-slate-500 truncate tracking-wide mt-0.5">
              {activeSchoolName}
            </p>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider truncate mt-0.5">
              {activeLocationSub}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 📱 TOP BAR MOBILE NAVBAR HEADER LAYER (Visible only under md view tracks) */}
      <div className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden print:hidden shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-black text-base tracking-tight text-slate-900">
            Assessment<span className="text-[#2563EB]">AI</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer focus:outline-none"
        >
          {isOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* 📱 MOBILE NAVIGATION DRAWER OVERLAY TRACKS */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-none">
          {/* Backdrop Blur Fog Layer */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Drawer content body structural block */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white p-4 flex flex-col justify-between shadow-xl border-r border-slate-200 z-50 overflow-y-auto">
            <NavContent />
          </div>
        </div>
      )}

      {/* 🖥️ DESKTOP LEFT SIDEBAR CONTAINER WRAPPER (Hidden on mobile via 'hidden md:flex') */}
      <div className="hidden md:flex w-64 h-screen bg-white border-r border-slate-200 flex-col justify-between p-4 font-sans print:hidden shrink-0">
        <NavContent />
      </div>
    </>
  );
}