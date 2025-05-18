"use client";

import React, { useState, useEffect } from "react";
import Providers from "@/contexts/Providers";

interface ProvidersWrapperProps {
    children: React.ReactNode;
    messages: unknown;
}

export default function ProvidersWrapper({ children, messages }: ProvidersWrapperProps) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return null;
    }
    
    return <Providers messages={messages}>{children}</Providers>;
}