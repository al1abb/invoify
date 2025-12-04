import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { base64Image } = await request.json();
    
    // Simple stub response - returns empty receipts array
    // In a real implementation, this would process the image with OCR
    return NextResponse.json({
      receipts: [],
      message: "OCR processing not configured"
    });
  } catch (error) {
    console.error('OCR API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}