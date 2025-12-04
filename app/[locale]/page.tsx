// Components
import TemplatesSidebar from "@/app/components/templates/TemplatesSidebar";
import ReceiptTemplatesGrid from "@/app/components/templates/ReceiptTemplatesGrid";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            <main className="flex flex-1">
                <TemplatesSidebar />
                <ReceiptTemplatesGrid />
            </main>
        </div>
    );
}
