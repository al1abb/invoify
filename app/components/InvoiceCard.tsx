"use client";

// Form imports
import { useForm } from "react-hook-form";

// Zod imports
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schemas
import { InvoiceSchema } from "@/lib/schemas";

// Shadcn components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Lucide React icons
import { Loader2 } from "lucide-react";

// Custom components
import {
    DatePickerFormField,
    FileFormField,
    InputFormField,
    InvoiceFooter,
    Items,
    PdfViewer,
    SelectFormField,
} from ".";

// Hooks
import { usePdfFunctions } from "../hooks/usePdfFunctions";

const InvoiceCard = () => {
    // const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());

    const {
        invoicePdf,
        invoicePdfLoading,
        generatePdf,
        downloadPdf,
        previewPdfInTab,
    } = usePdfFunctions();

    const form = useForm<z.infer<typeof InvoiceSchema>>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            sender: {
                name: "",
                address: "",
                zipCode: "",
                city: "",
                country: "",
                email: "",
                phone: "",
                vatNumber: "",
            },
            receiver: {
                name: "",
                address: "",
                zipCode: "",
                city: "",
                country: "",
                email: "",
                phone: "",
                vatNumber: "",
            },
            details: {
                invoiceLogo: "",
                invoiceNumber: "",
                invoiceDate: new Date(),
                dueDate: new Date(),
                items: [
                    {
                        name: "",
                        description: "",
                        quantity: 0,
                        unitPrice: 0,
                        total: 0,
                    },
                ],
                currency: "USD",
                language: "English",
                taxDetails: {
                    amount: 0,
                    taxID: "",
                    totalTaxAmount: 0,
                },
                discountDetails: {
                    amount: 0,
                },
                shippingDetails: {
                    cost: 0,
                },
                // subTotal: 0,
                // totalAmount: 0,
                additionalNotes: "",
                paymentTerms: "",
            },
        },
    });

    const { getValues, setValue } = form;

    const onSubmit = (values: z.infer<typeof InvoiceSchema>) => {
        console.log("VALUE");
        console.log(values);
        generatePdf(values);
    };

    return (
        <div className="max-w-5xl pt-10">
            <Card>
                <CardHeader>
                    <CardTitle>INVOICE</CardTitle>
                    <CardDescription>Generate invoice</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FileFormField
                                control={form.control}
                                name="details.invoiceLogo"
                                label="Invoice Logo"
                                placeholder="Invoice Logo"
                                setValue={setValue}
                            />
                            <div className="flex flex-wrap gap-40">
                                <div className="flex flex-col gap-2">

                                    <Label
                                        htmlFor="billFrom"
                                        className="text-xl font-semibold"
                                    >
                                        Bill From:
                                    </Label>

                                    <InputFormField
                                        control={form.control}
                                        name="sender.name"
                                        label="Name"
                                        placeholder="Your name"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.address"
                                        label="Address"
                                        placeholder="Your address"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.zipCode"
                                        label="Zip"
                                        placeholder="Your zip code"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.city"
                                        label="City"
                                        placeholder="Your city"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.country"
                                        label="Country"
                                        placeholder="Your country"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.email"
                                        label="Email"
                                        placeholder="Your email"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.phone"
                                        label="Phone"
                                        placeholder="Your phone number"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="sender.vatNumber"
                                        label="VAT Number"
                                        placeholder="Your VAT Number"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label
                                        htmlFor="billTo"
                                        className="text-xl font-semibold"
                                    >
                                        Bill To:
                                    </Label>

                                    <InputFormField
                                        control={form.control}
                                        name="receiver.name"
                                        label="Name"
                                        placeholder="Receiver name"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.address"
                                        label="Address"
                                        placeholder="Receiver address"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.zipCode"
                                        label="Zip"
                                        placeholder="Receiver zip code"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.city"
                                        label="City"
                                        placeholder="Receiver city"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.country"
                                        label="Country"
                                        placeholder="Receiver country"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.email"
                                        label="Email"
                                        placeholder="Receiver email"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.phone"
                                        label="Phone"
                                        placeholder="Receiver phone number"
                                    />
                                    <InputFormField
                                        control={form.control}
                                        name="receiver.vatNumber"
                                        label="VAT Number"
                                        placeholder="Receiver VAT Number"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-40">
                                <div className="flex flex-col gap-2">
                                    <Label
                                        htmlFor="invoiceDetails"
                                        className="text-xl font-semibold"
                                    >
                                        Invoice Details:
                                    </Label>

                                    <InputFormField
                                        control={form.control}
                                        name="details.invoiceNumber"
                                        label="Invoice number"
                                        placeholder="Invoice number"
                                    />

                                    <DatePickerFormField
                                        control={form.control}
                                        name="details.invoiceDate"
                                        label="Issued date"
                                        setValue={setValue}
                                    />

                                    <DatePickerFormField
                                        control={form.control}
                                        name="details.dueDate"
                                        label="Due date"
                                        setValue={setValue}
                                    />

                                    <SelectFormField
                                        control={form.control}
                                        name="details.currency"
                                        label="Currency"
                                        placeholder="Select Currency"
                                    />
                                </div>
                            </div>

                            <div>
                                <Items
                                    control={form.control}
                                    setValue={setValue}
                                    name="details.items"
                                />
                            </div>

                            <hr />

                            <div className="">
                                <InvoiceFooter
                                    control={form.control}
                                    getValues={getValues}
                                    setValue={setValue}
                                />
                            </div>

                            <Button type="submit" disabled={invoicePdfLoading}>
                                {invoicePdfLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    <span>Generate PDF</span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter>
                    {!invoicePdfLoading && invoicePdf.size != 0 && (
                        <div className="w-full">
                            <p>PDF Preview</p>
                            <PdfViewer pdfData={invoicePdf} />

                            <Button onClick={() => previewPdfInTab()}>
                                Preview in a new Tab
                            </Button>
                            <Button onClick={() => downloadPdf()}>
                                Download
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default InvoiceCard;
