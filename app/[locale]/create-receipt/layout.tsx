// This layout overrides the default locale layout for create-receipt page
export default function CreateReceiptLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-800">
            {children}
        </div>
    );
}