// React-email
import {
    Html,
    Body,
    Head,
    Hr,
    Container,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type SendPdfEmailProps = {
    invoiceNumber: string;
    body?: string;
    footer?: string;
};

const defaultBody = (invoiceNumber: string) =>
    `Please find your invoice #${invoiceNumber} attached.`;

const toParagraphLines = (value: string) => {
    return value
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);
};

export default function SendPdfEmail({
    invoiceNumber,
    body,
    footer,
}: SendPdfEmailProps) {
    const bodyLines = toParagraphLines(body?.trim() || defaultBody(invoiceNumber));
    const footerLines = toParagraphLines(footer?.trim() || "");
    return (
        <Html>
            <Head />
            <Preview>
                Your invoice #{invoiceNumber} is ready for download
            </Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container>
                        <Section className="bg-white border-black-950 my-10 px-10 py-4 rounded-md">
                            {bodyLines.map((line, idx) => (
                                <Text key={`${line}-${idx}`}>{line}</Text>
                            ))}

                            {footerLines.length > 0 ? (
                                <>
                                    <Hr />
                                    <Text>
                                        {footerLines.map((line, idx) => (
                                            <span key={`${line}-${idx}`}>
                                                {line}
                                                {idx < footerLines.length - 1 ? <br /> : null}
                                            </span>
                                        ))}
                                    </Text>
                                </>
                            ) : null}
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
