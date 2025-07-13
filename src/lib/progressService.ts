// src/lib/progressService.ts
export function listenForProgress(jobId: string, onUpdate: (progress: { percentage: number, message: string }) => void) {
  const eventSource = new EventSource(`/api/progress-stream?jobId=${encodeURIComponent(jobId)}`);
  
  eventSource.addEventListener('progress-update', (event: any) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
      if (data.percentage === 100) {
        eventSource.close();
      }
    } catch (error) {
      console.error('Failed to parse progress update:', error);
    }
  });
  
  eventSource.addEventListener('error', (event) => {
    console.error('EventSource error:', event);
    eventSource.close();
  });
  
  eventSource.onerror = (event) => {
    console.error('EventSource connection error:', event);
    eventSource.close();
  };
  
  return eventSource;
}
