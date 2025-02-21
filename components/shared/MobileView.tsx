'use client'
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "../../constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const MobileView = () => {
    const pathname = usePathname();
    return (
        <header className="header">
            <Link href="/" className="flex items-center gap-2 md:py-2">
                <Image
                    src="/assets/images/logo-text.svg"
                    alt="logo"
                    height={28}
                    width={180}
                />
            </Link>
            <nav className="flex gap-2">
                <SignedIn>
                    <UserButton />
                    <Sheet>
                        <SheetTrigger>
                            <Image src='/assets/icons/menu.svg' alt='menu' height={32} width={32}/>
                        </SheetTrigger>
                        <SheetContent className="sheet-content sm:w-64">
                            <>
                                <Image src='/assets/images/logo-text.svg' alt="logo" height={23} width={152}/>
                                <ul className='header-nav_elements'>
                                    {navLinks.slice(0,6).map((link)=>{
                                        const isActive = link.route === pathname;
                                        return (
                                            <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}>
                                                <Link href={link.route} className='sidebar-link'>
                                                    <Image src={link.icon} alt='logo' width={24} height={24} />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })} 
                                </ul>
                            </>
                        </SheetContent>
                    </Sheet>
                </SignedIn>
                <SignedOut>
                    <Button asChild className='button bg-purple-gradient bg-cover '>
                        <Link href='/sign-in'>Login</Link>
                    </Button>
                </SignedOut>
            </nav>
        </header>
    );
};

export default MobileView;
