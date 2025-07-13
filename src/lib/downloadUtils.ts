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
  answerKey: string | {
    solutions?: string;
    teachingTips?: string;
    commonMistakes?: string;
    extensionActivities?: string;
  };
  extensions?: string[];
  materials?: string[];
  images?: Array<{
    url: string;
    description: string;
    alt?: string;
  }>;
  visualElements?: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  error?: string;
}

// Simple PDF generation using browser's print functionality
export const downloadAsPDF = (worksheet: WorksheetResult) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${worksheet.title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 10px;
          }
          .meta {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 10px;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 5px;
          }
          .problem {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .problem-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .problem-number {
            background: #f97316;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 10px;
          }
          .problem-type {
            background: #fed7aa;
            color: #ea580c;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .problem-question {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .options {
            margin-left: 20px;
          }
          .option {
            margin-bottom: 5px;
          }
          .materials {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .extensions {
            background: #ddd6fe;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .answer-key {
            background: #dcfce7;
            padding: 15px;
            border-radius: 8px;
            page-break-before: always;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${worksheet.title}</div>
          <div class="meta">Grade: ${worksheet.grade} | Subject: ${worksheet.subject}</div>
          <div class="meta">Estimated Time: ${worksheet.estimatedTime}</div>
          <div class="meta">Topic: ${worksheet.topic}</div>
        </div>

        <div class="section">
          <div class="section-title">Description</div>
          <p>${worksheet.description}</p>
        </div>

        <div class="section">
          <div class="section-title">Instructions</div>
          <p>${worksheet.instructions}</p>
        </div>

        ${worksheet.materials && worksheet.materials.length > 0 ? `
        <div class="materials">
          <div class="section-title">Materials Needed</div>
          <ul>
            ${worksheet.materials.map((material: string) => `<li>${material}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Activities</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <div class="problem">
              <div class="problem-header">
                <div class="problem-number">${index + 1}</div>
                <div class="problem-type">${problem.type.replace('-', ' ')}</div>
              </div>
              <div class="problem-question">${problem.question}</div>
              ${problem.options ? `
                <div class="options">
                  ${problem.options.map((option: string) => `<div class="option">${option}</div>`).join('')}
                </div>
              ` : ''}
              ${problem.materials ? `<p><strong>Materials:</strong> ${problem.materials}</p>` : ''}
            </div>
          `).join('')}
        </div>

        ${worksheet.extensions && worksheet.extensions.length > 0 ? `
        <div class="extensions">
          <div class="section-title">Extension Activities</div>
          <ul>
            ${worksheet.extensions.map((extension: string) => `<li>${extension}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="answer-key">
          <div class="section-title">Answer Key & Teacher Notes</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <p><strong>${index + 1}.</strong> ${problem.answer}</p>
            ${problem.explanation ? `<p><em>Explanation:</em> ${problem.explanation}</p>` : ''}
            ${problem.christianConnection ? `<p><em>Faith Connection:</em> ${problem.christianConnection}</p>` : ''}
          `).join('')}
          ${worksheet.answerKey ? `<p><strong>Additional Notes:</strong> ${worksheet.answerKey}</p>` : ''}
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

// Simple DOCX generation using HTML conversion
export const downloadAsWord = (worksheet: WorksheetResult) => {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${worksheet.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #ea580c; }
          .meta { font-size: 14px; color: #666; }
          .section-title { font-size: 18px; font-weight: bold; color: #ea580c; margin: 20px 0 10px 0; }
          .problem { margin: 15px 0; padding: 10px; border: 1px solid #ccc; }
          .problem-number { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${worksheet.title}</div>
          <div class="meta">Grade: ${worksheet.grade} | Subject: ${worksheet.subject} | Time: ${worksheet.estimatedTime}</div>
        </div>

        <div class="section-title">Description</div>
        <p>${worksheet.description}</p>

        <div class="section-title">Instructions</div>
        <p>${worksheet.instructions}</p>

        ${worksheet.materials && worksheet.materials.length > 0 ? `
        <div class="section-title">Materials Needed</div>
        <ul>${worksheet.materials.map((material: string) => `<li>${material}</li>`).join('')}</ul>
        ` : ''}

        <div class="section-title">Activities</div>
        ${worksheet.problems.map((problem: any, index: number) => `
          <div class="problem">
            <span class="problem-number">${index + 1}. </span>
            <strong>${problem.question}</strong>
            ${problem.options ? `<ul>${problem.options.map((option: string) => `<li>${option}</li>`).join('')}</ul>` : ''}
            ${problem.materials ? `<p><em>Materials: ${problem.materials}</em></p>` : ''}
          </div>
        `).join('')}

        <div style="page-break-before: always;">
          <div class="section-title">Answer Key</div>
          ${worksheet.problems.map((problem: any, index: number) => `
            <p><strong>${index + 1}.</strong> ${problem.answer}</p>
            ${problem.explanation ? `<p><em>${problem.explanation}</em></p>` : ''}
          `).join('')}
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


