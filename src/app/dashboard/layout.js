'use client'
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { SessionProvider } from "@/providers/SessionProvider";
import { useState } from "react";


export default function DashboardLayout({ children }) {

    const [showSidebar, setShowSidebar] = useState(true);

    const handleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    return (
        <>
            <SessionProvider>
                <main className='flex flex-col h-screen  '>
                    <Navbar handleShowSidebar={handleShowSidebar} showSidebar={showSidebar} />

                    <section className="flex h-screen overflow-hidden bg-white relative">

                        <SideBar showSidebar={showSidebar} handleShowSidebar={handleShowSidebar} />

                        <div className="w-full bg-indigo-50 overflow-scroll p-2 relative">
                            {children}
                        </div>
                    </section>
                    {/* <SideBar showSidebar={showSidebar} />
                    <Navbar handleShowSidebar={handleShowSidebar} showSidebar={showSidebar} />

                    <section className={`w-full min-w-[300px] h-screen overflow-auto $ transition-all duration-700 ease-in`}>

                        <SideBar showSidebar={showSidebar} />

                        <div className="p-2">
                            {children}
                        </div>
                    </section> */}
                </main>
            </SessionProvider>
        </>
    );
}


