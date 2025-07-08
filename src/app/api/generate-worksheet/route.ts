import { NextRequest, NextResponse } from 'next/server';

import { ContentGenerator } from '../../../lib/ContentGenerator';

// Use the same worksheetStorage as in progress-stream (in production, use Redis/pubsub)
interface WorksheetStorage extends Map<string, any> {}
declare global {
  // eslint-disable-next-line no-var
  var __worksheetStorage: WorksheetStorage | undefined;
}
const worksheetStorage: WorksheetStorage = global.__worksheetStorage || (global.__worksheetStorage = new Map());

export async function POST(req: NextRequest) {
  const userSelections = await req.json();
  const jobId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  // Respond immediately with job ID
  setTimeout(() => startWorksheetJob(jobId, userSelections), 10);
  return NextResponse.json({ success: true, jobId });
}

async function startWorksheetJob(jobId: string, userSelections: any) {
  const generator = new ContentGenerator({
    progressCallback: (percentage: number, message: string) => {
      // Store progress in memory (replace with Redis/pubsub in production)
      worksheetStorage.set(jobId + '-progress', { percentage, message });
    }
  });
  try {
    const worksheet = await generator.generateWorksheet(userSelections);
    worksheetStorage.set(jobId, worksheet);
    worksheetStorage.set(jobId + '-progress', { percentage: 100, message: 'Worksheet ready for download!' });
  } catch (error: any) {
    worksheetStorage.set(jobId + '-progress', { percentage: 100, message: `Error: ${error.message}` });
  }
}

// For worksheet download (scaffold)
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');
  if (!jobId || !worksheetStorage.has(jobId)) {
    return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
  }
  return NextResponse.json({ worksheet: worksheetStorage.get(jobId) });
}
