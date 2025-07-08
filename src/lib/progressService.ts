// src/lib/progressService.ts
export function listenForProgress(jobId: string, onUpdate: (progress: { percentage: number, message: string }) => void) {
  const eventSource = new EventSource(`/api/progress-stream?jobId=${encodeURIComponent(jobId)}`);
  eventSource.addEventListener('progress-update', (event: any) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
    if (data.percentage === 100) {
      eventSource.close();
    }
  });
  eventSource.addEventListener('error', () => {
    eventSource.close();
  });
  return eventSource;
}
