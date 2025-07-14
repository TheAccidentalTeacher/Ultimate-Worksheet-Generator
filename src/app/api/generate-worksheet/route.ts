import { NextRequest, NextResponse } from 'next/server';
import { EnhancedContentGenerator } from '../../../lib/EnhancedContentGenerator';

export async function POST(req: NextRequest) {
  try {
    const userSelections = await req.json();
    console.log('[API] POST /api/generate-worksheet - User selections:', JSON.stringify(userSelections, null, 2));
    
    // Validate required fields
    if (!userSelections.grade || !userSelections.subject || !userSelections.topic) {
      console.error('[API] Missing required fields:', { 
        grade: userSelections.grade, 
        subject: userSelections.subject, 
        topic: userSelections.topic,
        receivedFields: Object.keys(userSelections)
      });
      return NextResponse.json({ 
        error: 'Missing required fields: grade, subject, topic',
        received: Object.keys(userSelections),
        details: { grade: !!userSelections.grade, subject: !!userSelections.subject, topic: !!userSelections.topic }
      }, { status: 400 });
    }

    console.log('[API] Starting synchronous worksheet generation...');
    
    // Generate worksheet synchronously instead of using background job
    const generator = new EnhancedContentGenerator({
      progressCallback: (percentage: number, message: string) => {
        console.log(`[SYNC] Progress: ${percentage}% - ${message}`);
      }
    });
    
    const worksheet = await generator.generateWorksheet(userSelections);
    console.log('[API] Worksheet generated successfully:', {
      title: worksheet?.title,
      problemsCount: worksheet?.problems?.length || 0,
      hasDescription: !!worksheet?.description,
      hasInstructions: !!worksheet?.instructions
    });
    
    // Validate worksheet has minimum required data
    if (!worksheet || !worksheet.problems || worksheet.problems.length === 0) {
      const errorMsg = 'Worksheet generation completed but no problems were created';
      console.error(`[API] ${errorMsg}:`, worksheet);
      return NextResponse.json({ 
        error: errorMsg,
        details: worksheet
      }, { status: 500 });
    }
    
    // Return worksheet directly
    return NextResponse.json({ 
      success: true, 
      worksheet: worksheet,
      generated: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('[API] Error in POST /api/generate-worksheet:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate worksheet',
      details: error.toString()
    }, { status: 500 });
  }
}
