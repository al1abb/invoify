"use client";

// Form imports
import { useForm } from "react-hook-form";

// Zod imports
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Custom components
import { InputFormField } from ".";
import { Label } from "@/components/ui/label";

const InvoiceCard = () => {
    const form = useForm<z.infer<typeof InvoiceSchema>>({
		resolver: zodResolver(InvoiceSchema),
		defaultValues: {
			sender: {
				senderName: "",
				senderAddress: "",
			}
		},
	});

	const onSubmit = (values: z.infer<typeof InvoiceSchema>) => {
		console.log("VALUE")
		console.log(values)
	}

    return (
        <div className="container pt-10">
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
							<div className="flex justify-around gap-2">
								<div className="flex flex-col gap-2">
									<Label htmlFor="billFrom" className="text-xl font-semibold">Bill From:</Label>

									<InputFormField 
										control={form.control}
										name="sender.senderName"
										label="Company"
										placeholder="Your company"
									/>
									<InputFormField 
										control={form.control}
										name="sender.address"
										label="Address"
										placeholder="Your address"
									/>

								</div>

								<div className="flex flex-col gap-2">

									<div>
										aaa
									</div>
								</div>
							</div>
							<Button type="submit">Submit</Button>
						</form>
					</Form>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default InvoiceCard;
