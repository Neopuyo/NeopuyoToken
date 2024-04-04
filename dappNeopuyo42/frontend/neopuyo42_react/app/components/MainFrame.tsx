"use client";

import React, { ReactNode } from 'react';
import Header from './Header';

interface MainFrameProps {
  children: ReactNode;
}

const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
  return (
    <div className={`h-full flex flex-col before:from-white after:from-sky-200 py-2`}>
      <Header />
      <div className="flex flex-col flex-1 justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default MainFrame;