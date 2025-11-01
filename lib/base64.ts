// A helper function to fetch and convert the image
export async function ImageToBase64(url:string) {
    // Check for a valid URL
    if (!url) {
        return '';
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        // Get the image as a buffer
        const buffer = await response.arrayBuffer();
        
        // Get the MIME type from the response headers
        const contentType = response.headers.get('content-type');
        
        // Convert the buffer to a Base64 string and create a data URL
        const base64String = Buffer.from(buffer).toString('base64');
        return `data:${contentType};base64,${base64String}`;
    } catch (error) {
        console.error("Error converting image to Base64:", error);
        return '';
    }
}