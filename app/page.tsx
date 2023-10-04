import Image from "next/image";

import { InvoiceCard } from "@/app/components";

export default function Home() {
    return (
        <main className="lg:container md:container sm:container-lg py-10 sm:py-4 xs:container-lg">

            {/* //TODO: Replace this with Navbar component. */}
            <Image 
                src={"/assets/img/invoify-logo.svg"}
                alt="Invoify Logo"
                width={200}
                height={100}
            />

			<InvoiceCard />
        </main>
    );
}
