declare module 'next-intl' {
    export interface RouterOptions {
        locale?: string;
    }

    export function useRouter(): {
        push: (href: string, options?: RouterOptions) => void;
    };
} 