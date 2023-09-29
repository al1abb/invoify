import Image from "next/image";

import { InvoiceCard } from "@/app/components";

export default function Home() {
    return (
        <main className="container sm:container-lg py-10 sm:py-4">
			<InvoiceCard />
        </main>
    );
}
