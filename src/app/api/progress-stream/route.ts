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

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let lastProgress = -1;
      const interval = setInterval(() => {
        const progress = worksheetStorage.get(jobId + '-progress');
        if (progress && progress.percentage !== lastProgress) {
          lastProgress = progress.percentage;
          controller.enqueue(
            encoder.encode(`event: progress-update\ndata: ${JSON.stringify(progress)}\n\n`)
          );
          if (progress.percentage === 100) {
            clearInterval(interval);
            controller.close();
          }
        }
      }, 500);
    },
    cancel() {}
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
