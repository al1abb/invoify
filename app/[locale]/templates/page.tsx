// Components
import TemplatesSidebar from "@/app/components/templates/TemplatesSidebar";
import ReceiptTemplatesGrid from "@/app/components/templates/ReceiptTemplatesGrid";

export default function TemplatesPage() {
    return (
        <main className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <TemplatesSidebar />
            <ReceiptTemplatesGrid />
        </main>
    );
}