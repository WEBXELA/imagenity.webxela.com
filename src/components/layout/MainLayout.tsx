import React from 'react';
import { Header } from './Header';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { WorkArea } from './WorkArea';
import { motion } from 'framer-motion';

export function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      <Header />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <WorkArea />
        <Sidebar />
      </div>
    </div>
  );
}