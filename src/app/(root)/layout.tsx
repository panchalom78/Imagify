import React from "react";
import SideBar from "../../components/shared/SideBar";
import MobileView from "../../components/shared/MobileView";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="root">
            <SideBar />
            <MobileView />
            <div className="root-container">
                <div className="wrapper">{children}</div>
            </div>
            <Toaster richColors/>
        </main>
    );
};

export default Layout;
