export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const jsonData = JSON.stringify(body);

        return new Response(jsonData, {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": "attachment; filename=data.json",
            },
            status: 200,
        });
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error exporting: \n${error}`, {
            status: 500,
        });
    }
}
