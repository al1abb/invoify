import React from "react";

import Image from "next/image";

import logo from "@/public/assets/img/invoify-logo.svg";

const BaseNavbar = () => {
    return (
        <nav className="container flex justify-between items-center py-5 px-10 bg-white">
            <div>
                <Image src={logo} alt="Invoify Logo" width={200} height={150} />

                <p>Generate invoices with ease.</p>
            </div>
        </nav>
    );
};

export default BaseNavbar;
