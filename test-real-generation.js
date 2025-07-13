// Real-World Quality Test
// Let's generate an actual worksheet using the enhanced system

export async function testRealWorksheetGeneration() {
  const testRequest = {
    grade: '5th',
    subject: 'Science', 
    topic: 'Solar System Planets',
    worksheetStyle: 'engaging',
    christianContent: '2', // Moderately Christian
    scaffolding: 'standard',
    differentiation: 'visual-learner',
    timeEstimate: '35 minutes',
    numProblems: 6
  };

  console.log('🧪 Testing Real Worksheet Generation');
  console.log('Student Level: 5th Grade Science');
  console.log('Topic: Solar System Planets');
  console.log('Faith Level: Moderately Christian');
  console.log('Expected APIs: OpenAI + Unsplash + Research');
  
  try {
    const response = await fetch('http://localhost:3001/api/generate-worksheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRequest)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Worksheet generation started successfully!');
    console.log('Job ID:', result.jobId);
    
    return result.jobId;
  } catch (error) {
    console.error('❌ Error testing real generation:', error.message);
    return null;
  }
}

// Run the test
testRealWorksheetGeneration();
