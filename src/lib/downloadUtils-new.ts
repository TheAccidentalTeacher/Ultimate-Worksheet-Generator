// Export types for use in components  
export interface WorksheetResult {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  description: string;
  instructions: string;
  estimatedTime: string;
  problems: Array<{
    id: number;
    type: string;
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
    christianConnection?: string;
    materials?: string;
  }>;
  answerKey: string;
  extensions?: string[];
  materials?: string[];
  error?: string;
}

// Enhanced PDF generation with truly whimsical design
export const downloadAsPDF = (worksheet: WorksheetResult) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const isColoringSheet = worksheet.subject === 'Coloring Sheet';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${worksheet.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&display=swap');
          
          body {
            font-family: 'Comic Neue', cursive;
            line-height: 1.6;
            color: #2D1B69;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: linear-gradient(45deg, #FFF9E6, #FFE4E1, #E6F3FF);
            min-height: 100vh;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border: 3px solid #FFB6C1;
          }
          
          .header::before {
            content: "✨";
            position: absolute;
            top: -10px;
            left: 20px;
            font-size: 24px;
          }
          
          .header::after {
            content: "🌟";
            position: absolute;
            top: -10px;
            right: 20px;
            font-size: 24px;
          }
          
          .title {
            font-family: 'Fredoka One', cursive;
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
          }
          
          .meta {
            font-size: 16px;
            color: #8E44AD;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          .name-line {
            margin-top: 20px;
            padding: 15px;
            background: linear-gradient(90deg, #FFE4E1, #E6F3FF);
            border-radius: 15px;
            border: 2px dashed #FF69B4;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #8E44AD;
          }
          
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border: 2px solid #87CEEB;
            position: relative;
          }
          
          .section-title {
            font-family: 'Fredoka One', cursive;
            font-size: 20px;
            font-weight: bold;
            color: #E91E63;
            margin-bottom: 15px;
            text-align: center;
            background: linear-gradient(90deg, #FFE4E1, #E6F3FF);
            padding: 10px;
            border-radius: 10px;
            border: 2px solid #FFB6C1;
          }
          
          .problem {
            margin-bottom: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #FFF9E6, #F0F8FF);
            border-radius: 20px;
            border: 3px solid #98FB98;
            page-break-inside: avoid;
            position: relative;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          }
          
          .coloring-area {
            min-height: 400px;
            border: 4px solid #FF69B4;
            border-radius: 20px;
            background: white;
            margin: 20px 0;
            padding: 20px;
            position: relative;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #8E44AD;
            font-weight: bold;
          }
          
          .coloring-instructions {
            background: linear-gradient(90deg, #FFE4E1, #E6F3FF);
            border: 3px dashed #FF69B4;
            border-radius: 15px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #8E44AD;
          }
          
          .problem-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .problem-number {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            font-size: 18px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          
          .problem-type {
            background: linear-gradient(45deg, #FFE135, #FF6B9D);
            color: #2D1B69;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .problem-question {
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 18px;
            color: #2D1B69;
            line-height: 1.4;
          }
          
          .options {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          
          .option {
            margin-bottom: 8px;
            padding: 8px 15px;
            background: #F0F8FF;
            border-radius: 10px;
            border: 2px solid #87CEEB;
            font-size: 16px;
            color: #2D1B69;
          }
          
          .answer-key {
            background: linear-gradient(135deg, #E8F5E8, #F0F8FF);
            padding: 25px;
            border-radius: 20px;
            page-break-before: always;
            border: 4px solid #98FB98;
            position: relative;
          }
          
          @media print {
            body { 
              margin: 0; 
              background: white !important;
            }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${worksheet.title}</div>
          <div class="meta">🎓 Grade: ${worksheet.grade} | 📚 Subject: ${worksheet.subject}</div>
          <div class="meta">⏰ Time: ${worksheet.estimatedTime} | 🎯 Topic: ${worksheet.topic}</div>
          <div class="name-line">
            🌟 Name: ________________________ 🌟
          </div>
        </div>

        ${worksheet.description ? `
        <div class="section">
          <div class="section-title">📖 What You'll Learn</div>
          <p style="font-size: 16px; text-align: center; color: #2D1B69;">${worksheet.description}</p>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">📋 Instructions</div>
          <p style="font-size: 16px; text-align: center; color: #2D1B69; font-weight: bold;">${worksheet.instructions}</p>
        </div>

        <div class="section">
          <div class="section-title">${isColoringSheet ? '🎨 Color Me Beautiful!' : '🎯 Activities'}</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <div class="problem">
              <div class="problem-header">
                <div class="problem-number">${index + 1}</div>
                <div class="problem-type">${problem.type.replace('-', ' ')}</div>
              </div>
              ${isColoringSheet ? `
                <div class="coloring-instructions">
                  ${problem.question}
                </div>
                <div class="coloring-area">
                  🎨 Draw and color your ${worksheet.topic} here! 🌈
                </div>
              ` : `
                <div class="problem-question">${problem.question}</div>
                ${problem.options ? `
                  <div class="options">
                    ${problem.options.map((option: string) => `<div class="option">${option}</div>`).join('')}
                  </div>
                ` : ''}
              `}
            </div>
          `).join('')}
        </div>

        <div class="answer-key page-break">
          <div class="section-title">🔑 Answer Key & Teacher Notes</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 10px; border: 2px solid #98FB98;">
              <p style="font-weight: bold; color: #2D1B69;"><span style="color: #E91E63;">${index + 1}.</span> ${problem.answer}</p>
              ${problem.explanation ? `<p style="font-style: italic; color: #8E44AD;"><strong>Why:</strong> ${problem.explanation}</p>` : ''}
              ${problem.christianConnection ? `<p style="color: #9B59B6;"><strong>💕 Faith Connection:</strong> ${problem.christianConnection}</p>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #8E44AD; font-size: 14px;">
          Made with 💕 by WorksheetWise | Keep being amazing! 🌟
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Enhanced DOCX generation
export const downloadAsWord = (worksheet: WorksheetResult) => {
  const isColoringSheet = worksheet.subject === 'Coloring Sheet';
  
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${worksheet.title}</title>
        <style>
          body { 
            font-family: 'Comic Sans MS', cursive; 
            line-height: 1.6; 
            color: #2D1B69;
            background-color: #FFF9E6;
          }
          .header { 
            text-align: center; 
            border: 3px solid #FFB6C1; 
            padding: 20px; 
            margin-bottom: 30px;
            background-color: white;
            border-radius: 15px;
          }
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #E91E63; 
            margin-bottom: 10px;
          }
          .meta { 
            font-size: 14px; 
            color: #8E44AD; 
            font-weight: bold;
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #E91E63; 
            margin: 20px 0 10px 0;
            text-align: center;
            background-color: #FFE4E1;
            padding: 10px;
            border-radius: 10px;
          }
          .problem { 
            margin: 15px 0; 
            padding: 15px; 
            border: 2px solid #98FB98;
            background-color: white;
            border-radius: 15px;
          }
          .problem-number { 
            font-weight: bold; 
            color: #FF6B6B;
            font-size: 18px;
          }
          .coloring-area {
            min-height: 300px;
            border: 3px solid #FF69B4;
            margin: 20px 0;
            padding: 20px;
            text-align: center;
            background-color: white;
            border-radius: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">✨ ${worksheet.title} ✨</div>
          <div class="meta">🎓 Grade: ${worksheet.grade} | 📚 Subject: ${worksheet.subject} | ⏰ Time: ${worksheet.estimatedTime}</div>
          <div style="margin-top: 15px; font-size: 16px; font-weight: bold;">
            🌟 Name: ________________________ 🌟
          </div>
        </div>

        <div class="section-title">📖 What You'll Learn</div>
        <p>${worksheet.description}</p>

        <div class="section-title">📋 Instructions</div>
        <p style="font-weight: bold; text-align: center;">${worksheet.instructions}</p>

        <div class="section-title">${isColoringSheet ? '🎨 Color Me Beautiful!' : '🎯 Activities'}</div>
        ${worksheet.problems.map((problem: any, index: number) => `
          <div class="problem">
            <span class="problem-number">${index + 1}. </span>
            <strong>${problem.question}</strong>
            ${isColoringSheet ? `
              <div class="coloring-area">
                🎨 Draw and color your ${worksheet.topic} here! 🌈<br><br>
                Use your favorite colors and make it beautiful!
              </div>
            ` : ''}
            ${problem.options && !isColoringSheet ? `<ul>${problem.options.map((option: string) => `<li>${option}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}

        <div style="page-break-before: always;">
          <div class="section-title">🔑 Answer Key & Teacher Notes</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <p><strong style="color: #E91E63;">${index + 1}.</strong> ${problem.answer}</p>
            ${problem.explanation ? `<p><em style="color: #8E44AD;">${problem.explanation}</em></p>` : ''}
            ${problem.christianConnection ? `<p style="color: #9B59B6;"><strong>💕 Faith Connection:</strong> ${problem.christianConnection}</p>` : ''}
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #8E44AD;">
          Made with 💕 by WorksheetWise | Keep being amazing! 🌟
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${worksheet.title.replace(/[^a-z0-9]/gi, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
