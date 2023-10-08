import React from "react";

import Image from "next/image";

const BaseNavbar = () => {
    return (
        <nav className="container flex justify-between items-center py-5 px-10 bg-white">
            <div>
                <Image
                    src={"/assets/img/invoify-logo.svg"}
                    alt="Invoify Logo"
                    width={200}
                    height={100}
                />

                <p>Generate invoices with ease.</p>
            </div>
        </nav>
    );
};

export default BaseNavbar;
