import Image from "next/image";

import { InvoiceCard } from "@/app/components";

export default function Home() {
    return (
        <main className="flex justify-center">
			<InvoiceCard />
        </main>
    );
}
