// src/lib/progressService.ts
export function listenForProgress(jobId: string, onUpdate: (progress: { percentage: number, message: string }) => void) {
  console.log(`[PROGRESS-SERVICE] Starting EventSource for job: ${jobId}`);
  
  const eventSource = new EventSource(`/api/progress-stream?jobId=${encodeURIComponent(jobId)}`);
  let isConnected = false;
  let lastHeartbeat = Date.now();
  let connectionRetries = 0;
  const maxRetries = 3;
  
  eventSource.onopen = () => {
    console.log(`[PROGRESS-SERVICE] EventSource connected for job: ${jobId}`);
    isConnected = true;
    connectionRetries = 0;
  };
  
  eventSource.addEventListener('progress-update', (event: any) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`[PROGRESS-SERVICE] Received progress update:`, data);
      lastHeartbeat = Date.now();
      onUpdate(data);
      
      if (data.percentage === 100) {
        console.log(`[PROGRESS-SERVICE] Job completed, closing EventSource`);
        eventSource.close();
      }
    } catch (error) {
      console.error('[PROGRESS-SERVICE] Failed to parse progress update:', error, event.data);
    }
  });
  
  eventSource.addEventListener('heartbeat', (event: any) => {
    console.log(`[PROGRESS-SERVICE] Received heartbeat`);
    lastHeartbeat = Date.now();
  });
  
  eventSource.addEventListener('error', (event) => {
    console.error('[PROGRESS-SERVICE] EventSource error:', event);
    isConnected = false;
    connectionRetries++;
    
    if (connectionRetries >= maxRetries) {
      console.error(`[PROGRESS-SERVICE] Max retries (${maxRetries}) exceeded, giving up`);
      eventSource.close();
    }
  });
  
  eventSource.onerror = (event) => {
    console.error('[PROGRESS-SERVICE] EventSource connection error:', event);
    isConnected = false;
    
    // Log the specific error details
    console.error('[PROGRESS-SERVICE] ReadyState:', eventSource.readyState);
    console.error('[PROGRESS-SERVICE] URL:', eventSource.url);
    
    // If we lose connection and haven't completed, let the timeout handle it
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log('[PROGRESS-SERVICE] Connection permanently closed');
    }
  };
  
  // Monitor connection health - this will catch stuck connections
  const healthCheck = setInterval(() => {
    if (!isConnected && Date.now() - lastHeartbeat > 10000) { // 10 seconds without connection
      console.warn('[PROGRESS-SERVICE] Connection appears stuck, closing and will retry via timeout');
      clearInterval(healthCheck);
      eventSource.close();
    }
  }, 5000);
  
  // Return enhanced EventSource with cleanup
  const enhancedEventSource = {
    close: () => {
      console.log(`[PROGRESS-SERVICE] Manually closing EventSource for job: ${jobId}`);
      clearInterval(healthCheck);
      eventSource.close();
    },
    readyState: eventSource.readyState
  };
  
  return enhancedEventSource;
}
