import { NextRequest, NextResponse } from 'next/server';

import { EnhancedContentGenerator } from '../../../lib/EnhancedContentGenerator';
import { ContentGenerator } from '../../../lib/ContentGenerator';

// Use the same worksheetStorage as in progress-stream (in production, use Redis/pubsub)
interface WorksheetStorage extends Map<string, any> {}
declare global {
  // eslint-disable-next-line no-var
  var __worksheetStorage: WorksheetStorage | undefined;
}
const worksheetStorage: WorksheetStorage = global.__worksheetStorage || (global.__worksheetStorage = new Map());

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

    const jobId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    console.log('[API] Created job ID:', jobId);

    // Respond immediately with job ID
    setTimeout(() => startWorksheetJob(jobId, userSelections), 10);
    return NextResponse.json({ success: true, jobId });
  } catch (error: any) {
    console.error('[API] Error in POST /api/generate-worksheet:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

import type { UserSelections } from '../../../lib/types';
async function startWorksheetJob(jobId: string, userSelections: UserSelections) {
  console.log(`[JOB ${jobId}] Starting enhanced worksheet generation...`);
  
  // Use Enhanced Content Generator for intelligent API selection
  const generator = new EnhancedContentGenerator({
    progressCallback: (percentage: number, message: string) => {
      console.log(`[JOB ${jobId}] Progress: ${percentage}% - ${message}`);
      // Store progress in memory (replace with Redis/pubsub in production)
      worksheetStorage.set(jobId + '-progress', { percentage, message });
    }
  });
  
  try {
    const worksheet = await generator.generateWorksheet(userSelections);
    console.log(`[JOB ${jobId}] Worksheet generated successfully:`, {
      title: worksheet?.title,
      problemsCount: worksheet?.problems?.length || 0,
      hasDescription: !!worksheet?.description,
      hasInstructions: !!worksheet?.instructions
    });
    
    // Validate worksheet has minimum required data
    if (!worksheet || !worksheet.problems || worksheet.problems.length === 0) {
      const errorMsg = 'Worksheet generation completed but no problems were created';
      console.error(`[JOB ${jobId}] ${errorMsg}:`, worksheet);
      worksheetStorage.set(jobId + '-progress', { percentage: 100, message: `Error: ${errorMsg}` });
      worksheetStorage.set(jobId, { error: errorMsg });
      return;
    }
    
    worksheetStorage.set(jobId, worksheet);
    worksheetStorage.set(jobId + '-progress', { percentage: 100, message: 'Worksheet ready for download!' });
  } catch (error: any) {
    console.error(`[JOB ${jobId}] Error during worksheet generation:`, error);
    const errorMsg = `Error: ${error.message || 'Unknown error during generation'}`;
    worksheetStorage.set(jobId + '-progress', { percentage: 100, message: errorMsg });
    worksheetStorage.set(jobId, { error: error.message || 'Unknown error during generation' });
  }
}

// For worksheet download (scaffold)
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');
  console.log(`[API] GET /api/generate-worksheet - Job ID: ${jobId}`);
  
  if (!jobId) {
    console.error('[API] No jobId provided in GET request');
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }
  
  if (!worksheetStorage.has(jobId)) {
    console.error(`[API] Worksheet not found for job ID: ${jobId}`);
    console.log(`[API] Available job IDs in storage:`, Array.from(worksheetStorage.keys()));
    return NextResponse.json({ 
      error: 'Worksheet not found. The worksheet may have expired or the job is still processing.',
      jobId: jobId,
      availableJobs: Array.from(worksheetStorage.keys()).length
    }, { status: 404 });
  }
  
  const worksheet = worksheetStorage.get(jobId);
  console.log(`[API] Returning worksheet for job ${jobId}:`, {
    hasError: !!worksheet?.error,
    hasProblems: !!worksheet?.problems,
    problemsCount: worksheet?.problems?.length || 0
  });
  
  return NextResponse.json({ worksheet });
}
