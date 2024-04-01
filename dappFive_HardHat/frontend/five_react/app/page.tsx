import React from "react"
import Image from "next/image";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`h-full flex flex-col before:from-white after:from-sky-200 py-2 ${inter.className}`}
    >
      <Header />
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="grid gap-4">
          <Image
            src="https://images.ctfassets.net/9sy2a0egs6zh/4zJfzJbG3kTDSk5Wo4RJI1/1b363263141cf629b28155e2625b56c9/mm-logo.svg"
            alt="MetaMask"
            width={320}
            height={140}
            priority
          />
          <button className="bg-black text-white p-4 rounded-lg">
            Connect to MetaMask
          </button>
        </div>
      </div>
    </div>
  );
}