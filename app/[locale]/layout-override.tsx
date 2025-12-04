// This will be used to override the main layout for specific pages
export default function LayoutOverride({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}