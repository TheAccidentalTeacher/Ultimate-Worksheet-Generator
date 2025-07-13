import { NextRequest } from 'next/server';

// Use the same worksheetStorage as in generate-worksheet (in production, use Redis/pubsub)
interface WorksheetStorage extends Map<string, any> {}
declare global {
  // eslint-disable-next-line no-var
  var __worksheetStorage: WorksheetStorage | undefined;
}
const worksheetStorage: WorksheetStorage = global.__worksheetStorage || (global.__worksheetStorage = new Map());

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');
  if (!jobId) {
    return new Response('Missing jobId', { status: 400 });
  }

  console.log(`[PROGRESS-STREAM] Starting stream for job: ${jobId}`);

  const encoder = new TextEncoder();
  let interval: NodeJS.Timeout;
  
  const stream = new ReadableStream({
    start(controller) {
      let lastProgress = -1;
      let heartbeatCount = 0;
      
      interval = setInterval(() => {
        try {
          const progress = worksheetStorage.get(jobId + '-progress');
          
          // Send heartbeat every 10 iterations (5 seconds) if no progress updates
          if (!progress) {
            heartbeatCount++;
            if (heartbeatCount % 10 === 0) {
              controller.enqueue(
                encoder.encode(`event: heartbeat\ndata: {"heartbeat": ${heartbeatCount}}\n\n`)
              );
            }
            return;
          }
          
          if (progress.percentage !== lastProgress) {
            lastProgress = progress.percentage;
            console.log(`[PROGRESS-STREAM] Sending progress update: ${progress.percentage}%`);
            controller.enqueue(
              encoder.encode(`event: progress-update\ndata: ${JSON.stringify(progress)}\n\n`)
            );
            
            if (progress.percentage === 100) {
              console.log(`[PROGRESS-STREAM] Job ${jobId} completed, closing stream`);
              clearInterval(interval);
              controller.close();
            }
          }
        } catch (error) {
          console.error(`[PROGRESS-STREAM] Error in stream for ${jobId}:`, error);
          clearInterval(interval);
          controller.error(error);
        }
      }, 500);
      
      // Cleanup after 2 minutes to prevent hanging streams
      setTimeout(() => {
        if (interval) {
          console.log(`[PROGRESS-STREAM] Timeout cleanup for job: ${jobId}`);
          clearInterval(interval);
          controller.close();
        }
      }, 120000);
    },
    
    cancel() {
      console.log(`[PROGRESS-STREAM] Client cancelled stream for job: ${jobId}`);
      if (interval) {
        clearInterval(interval);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
