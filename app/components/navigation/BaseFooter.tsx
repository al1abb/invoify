"use client";

import React from "react";

import { useTranslations } from "next-intl";

const BaseFooter = () => {
    const _t = useTranslations();
    return (
        <div className="container py-10">
            <p>
                {_t("footer.developedBy")}{" "}
                <a
                    href="https://github.com/aliabb01"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                >
                    Ali Abbasov
                </a>
            </p>
        </div>
    );
};

export default BaseFooter;
