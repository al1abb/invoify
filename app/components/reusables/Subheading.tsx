import React from "react";

type SubheadingProps = {
    children: React.ReactNode;
};

export default function Subheading({ children }: SubheadingProps) {
    return <h4 className="text-xl font-semibold">{children}</h4>;
}
