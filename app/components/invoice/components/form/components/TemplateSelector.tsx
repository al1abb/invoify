// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type TemplateSelectorProps = {};

const TemplateSelector = ({}: TemplateSelectorProps) => {
    const templates = [
        {
            name: "Template 1",
            description: "Template 1 description",
            img: "img src",
        },
        {
            name: "Template 2",
            description: "Template 2 description",
            img: "img src",
        },
        {
            name: "Template 3",
            description: "Template 3 description",
            img: "img src",
        },
    ];
    return (
        <>
            <div>
                <Label>Choose invoice template</Label>

                <div>
                    <Card>
                        <CardHeader>
                            <p>Template 1</p>
                            <CardDescription>
                                Template 1 description
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {templates.map((template, idx) => (
                                <>
                                    <p>{template.name}</p>
                                </>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default TemplateSelector;
