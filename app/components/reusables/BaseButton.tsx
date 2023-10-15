"use client";

import React from "react";

// Shadcn
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { Loader2 } from "lucide-react";

type BaseButtonProps = {
    tooltipLabel?: string;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
} & ButtonProps;

const BaseButton = ({
    tooltipLabel,
    type = "button",
    loading,
    loadingText = "Loading",
    children,
    ...props
}: BaseButtonProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {!loading ? (
                        <Button type={type} {...props}>
                            {children}
                        </Button>
                    ) : (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {loadingText}
                        </Button>
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipLabel}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default BaseButton;
