export interface ColoringSheetResult {
  title: string;
  theme: string;
  ageGroup: string;
  faithLevel: string;
  description: string;
  instructions: string;
  coloringPages: Array<{
    id: number;
    title: string;
    description: string;
    elements: string[];
    christianConnection?: string;
    coloringTips?: string[];
  }>;
  materials: string[];
}

// Generate truly whimsical coloring sheet PDFs
export const downloadColoringSheetAsPDF = (coloringSheet: ColoringSheetResult, images?: string[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Helper to get image for a page index
  const getImage = (idx: number) => images && images[idx] ? `<div style="text-align:center;margin:20px 0;"><img src='${images[idx]}' alt='Coloring page image' style='max-width:100%;max-height:500px;border:3px dashed #FFB6C1;border-radius:18px;background:#fff;box-shadow:0 2px 12px #f8bbd0;'/></div>` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${coloringSheet.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&family=Caveat:wght@400;700&display=swap');
          
          body {
            font-family: 'Comic Neue', cursive;
            line-height: 1.8;
            color: #2D1B69;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: linear-gradient(45deg, #FFF9E6, #FFE4E1, #E6F3FF);
            min-height: 100vh;
            position: relative;
          }
          
          /* Whimsical border decorations */
          body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(173, 216, 230, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 0, 0.2) 0%, transparent 50%);
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            background: white;
            border-radius: 25px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 4px dashed #FFB6C1;
          }
          
          .header::before {
            content: "🎨✨🌈";
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0 10px;
            font-size: 20px;
          }
          
          .title {
            font-family: 'Fredoka One', cursive;
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          
          .subtitle {
            font-family: 'Caveat', cursive;
            font-size: 20px;
            color: #8E44AD;
            margin-bottom: 10px;
            font-weight: bold;
          }
          
          .meta {
            font-size: 16px;
            color: #6C5CE7;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          .name-section {
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #FFE4E1, #E6F3FF);
            border-radius: 20px;
            border: 3px solid #FFB6C1;
            text-align: center;
            position: relative;
          }
          
          .name-section::before {
            content: "🌟";
            position: absolute;
            top: -10px;
            left: 20px;
            font-size: 24px;
          }
          
          .name-section::after {
            content: "⭐";
            position: absolute;
            top: -10px;
            right: 20px;
            font-size: 24px;
          }
          
          .name-line {
            font-family: 'Caveat', cursive;
            font-size: 22px;
            color: #2D1B69;
            font-weight: bold;
            margin-bottom: 15px;
          }
          
          .name-input {
            border: none;
            border-bottom: 3px dotted #FFB6C1;
            background: transparent;
            width: 300px;
            padding: 10px 5px;
            font-size: 18px;
            font-family: 'Caveat', cursive;
            text-align: center;
            margin: 0 10px;
          }
          
          .instructions {
            background: linear-gradient(135deg, #FFF9E6, #FFE4E1);
            border-radius: 20px;
            padding: 20px;
            margin: 25px 0;
            border: 3px solid #FFEAA7;
            position: relative;
          }
          
          .instructions::before {
            content: "📝";
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 20px;
          }
          
          .instructions h3 {
            font-family: 'Fredoka One', cursive;
            color: #E17055;
            margin-bottom: 15px;
            font-size: 20px;
          }
          
          .instructions p {
            color: #2D1B69;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 10px;
          }
          
          .coloring-page {
            margin: 40px 0;
            padding: 30px;
            background: white;
            border-radius: 25px;
            border: 4px solid #FFB6C1;
            position: relative;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            page-break-inside: avoid;
          }
          
          .coloring-page::before {
            content: "🎨";
            position: absolute;
            top: -15px;
            left: 30px;
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 24px;
          }
          
          .page-title {
            font-family: 'Fredoka One', cursive;
            font-size: 24px;
            color: #6C5CE7;
            text-align: center;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .page-description {
            font-family: 'Caveat', cursive;
            font-size: 18px;
            color: #2D1B69;
            text-align: center;
            margin-bottom: 25px;
            font-weight: bold;
          }
          
          .coloring-area {
            min-height: 400px;
            border: 4px dashed #FFB6C1;
            border-radius: 20px;
            background: 
              radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(173, 216, 230, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 0, 0.05) 0%, transparent 50%),
              linear-gradient(45deg, #FFEAA7 25%, transparent 25%), 
              linear-gradient(-45deg, #FFEAA7 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #FFEAA7 75%), 
              linear-gradient(-45deg, transparent 75%, #FFEAA7 75%);
            background-size: 
              100% 100%, 100% 100%, 100% 100%,
              40px 40px, 40px 40px, 40px 40px, 40px 40px;
            background-position: 
              0 0, 0 0, 0 0,
              0 0, 0 20px, 20px -20px, -20px 0px;
            background-color: #FFFEF7;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 40px;
            box-shadow: inset 0 0 20px rgba(255, 182, 193, 0.3);
          }
          
          .coloring-prompt {
            font-family: 'Caveat', cursive;
            font-size: 22px;
            color: #6C5CE7;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.8);
            padding: 15px;
            border-radius: 15px;
            border: 2px solid #FFB6C1;
          }
          
          .elements-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          
          .element-item {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #4ECDC4;
            border-radius: 15px;
            padding: 15px;
            text-align: center;
            font-family: 'Caveat', cursive;
            font-size: 18px;
            color: #2D1B69;
            font-weight: bold;
          }
          
          .christian-connection {
            background: linear-gradient(135deg, #FFE4E1, #E6F3FF);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border: 3px solid #DDA0DD;
            position: relative;
          }
          
          .christian-connection::before {
            content: "✝️";
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 18px;
          }
          
          .christian-connection h4 {
            font-family: 'Fredoka One', cursive;
            color: #8E44AD;
            margin-bottom: 10px;
            font-size: 18px;
          }
          
          .christian-connection p {
            color: #2D1B69;
            font-size: 16px;
            line-height: 1.6;
          }
          
          .coloring-tips {
            background: linear-gradient(135deg, #E6F3FF, #FFF9E6);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border: 3px solid #98D8C8;
            position: relative;
          }
          
          .coloring-tips::before {
            content: "💡";
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 20px;
          }
          
          .coloring-tips h4 {
            font-family: 'Fredoka One', cursive;
            color: #00B894;
            margin-bottom: 15px;
            font-size: 18px;
          }
          
          .coloring-tips ul {
            list-style: none;
            padding: 0;
          }
          
          .coloring-tips li {
            color: #2D1B69;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 8px;
            position: relative;
            padding-left: 25px;
          }
          
          .coloring-tips li::before {
            content: "🖍️";
            position: absolute;
            left: 0;
            font-size: 14px;
          }
          
          .materials {
            background: linear-gradient(135deg, #E6F3FF, #FFE4E1);
            border-radius: 15px;
            padding: 20px;
            margin-top: 25px;
            border: 3px solid #74B9FF;
            position: relative;
          }
          
          .materials::before {
            content: "🎨";
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 20px;
          }
          
          .materials h4 {
            font-family: 'Fredoka One', cursive;
            color: #0984E3;
            margin-bottom: 15px;
            font-size: 18px;
          }
          
          .materials ul {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
          }
          
          .materials li {
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid #74B9FF;
            border-radius: 10px;
            padding: 8px 12px;
            text-align: center;
            font-size: 14px;
            color: #2D1B69;
            font-weight: bold;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            font-family: 'Caveat', cursive;
            font-size: 18px;
            color: #8E44AD;
            background: linear-gradient(135deg, #FFE4E1, #E6F3FF);
            border-radius: 20px;
            border: 3px solid #DDA0DD;
            position: relative;
          }
          
          .footer::before {
            content: "💕";
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 5px;
            border-radius: 50%;
            font-size: 20px;
          }
          
          @media print {
            body {
              background: white;
            }
            
            .coloring-page {
              page-break-before: always;
            }
            
            .coloring-page:first-child {
              page-break-before: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${coloringSheet.title}</div>
          <div class="subtitle">A Magical Coloring Adventure!</div>
          <div class="meta">Theme: ${coloringSheet.theme} | Age: ${coloringSheet.ageGroup}</div>
          <div class="meta">Faith Level: ${coloringSheet.faithLevel}</div>
        </div>
        
        <div class="name-section">
          <div class="name-line">This special coloring book belongs to:</div>
          <input type="text" class="name-input" placeholder="Write your name here!" />
          <div style="font-size: 14px; color: #8E44AD; margin-top: 10px;">
            Created with love on ${new Date().toLocaleDateString()} ✨
          </div>
        </div>
        
        <div class="instructions">
          <h3>How to Use This Coloring Book 🎨</h3>
          <p>${coloringSheet.instructions}</p>
          <p>Remember: There's no wrong way to color! Let your creativity shine and have fun! 🌈</p>
        </div>
        
        ${coloringSheet.coloringPages.map((page, idx) => `
          <div class="coloring-page">
            <div class="page-title">${page.title}</div>
            <div class="page-description">${page.description}</div>
            ${getImage(idx)}
            <div class="coloring-area">
              <div class="coloring-prompt">
                Imagine and color: ${page.description}
              </div>
              <div class="elements-list">
                ${page.elements.map(element => `
                  <div class="element-item">${element}</div>
                `).join('')}
              </div>
            </div>
            ${page.christianConnection ? `
              <div class="christian-connection">
                <h4>Faith Connection 🙏</h4>
                <p>${page.christianConnection}</p>
              </div>
            ` : ''}
            ${page.coloringTips ? `
              <div class="coloring-tips">
                <h4>Coloring Tips & Ideas 💡</h4>
                <ul>
                  ${page.coloringTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
        
        <div class="materials">
          <h4>What You'll Need 🎨</h4>
          <ul>
            ${coloringSheet.materials.map(material => `<li>${material}</li>`).join('')}
          </ul>
        </div>
        
        <div class="footer">
          Made with lots of love and creativity! 💕<br>
          Keep coloring and keep smiling! 🌟
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Generate sample coloring sheet data
export const generateColoringSheetData = (theme: string, ageGroup: string, faithLevel: string): ColoringSheetResult => {
  const themes = {
    animals: {
      title: "Amazing Animal Kingdom",
      description: "Discover and color beautiful creatures from around the world!",
      pages: [
        {
          title: "Majestic Lion",
          description: "A brave lion with a flowing mane standing proudly in the savanna",
          elements: ["Lion with flowing mane", "Savanna grass", "Acacia tree", "Bright sun", "Butterflies"]
        },
        {
          title: "Gentle Elephant Family",
          description: "A loving elephant family walking together through the jungle",
          elements: ["Parent elephants", "Baby elephant", "Jungle trees", "Colorful flowers", "Friendly birds"]
        },
        {
          title: "Playful Dolphins",
          description: "Happy dolphins jumping and playing in the ocean waves",
          elements: ["Jumping dolphins", "Ocean waves", "Seashells", "Starfish", "Coral reef"]
        }
      ]
    },
    nature: {
      title: "Wonder of Nature",
      description: "Explore the beautiful world of plants, flowers, and landscapes!",
      pages: [
        {
          title: "Enchanted Garden",
          description: "A magical garden filled with flowers, butterflies, and sunshine",
          elements: ["Blooming flowers", "Fluttering butterflies", "Buzzing bees", "Garden path", "Fountain"]
        },
        {
          title: "Mighty Oak Tree",
          description: "A grand old tree with spreading branches and friendly woodland creatures",
          elements: ["Oak tree", "Squirrels", "Birds nest", "Falling leaves", "Mushrooms"]
        },
        {
          title: "Rainbow After Rain",
          description: "A beautiful rainbow arching over a peaceful landscape",
          elements: ["Colorful rainbow", "Fluffy clouds", "Rolling hills", "Wildflowers", "Puddles"]
        }
      ]
    },
    bible: {
      title: "Biblical Adventures",
      description: "Journey through wonderful Bible stories and characters!",
      pages: [
        {
          title: "Noah's Ark",
          description: "Noah's ark floating safely with pairs of animals aboard",
          elements: ["Large wooden ark", "Pairs of animals", "Dove with olive branch", "Rainbow", "Mount Ararat"]
        },
        {
          title: "David and Goliath",
          description: "Young David facing the giant Goliath with faith and courage",
          elements: ["David with sling", "Giant Goliath", "Smooth stones", "Shepherd's staff", "Israelite camp"]
        },
        {
          title: "Jesus and the Children",
          description: "Jesus welcoming and blessing the little children",
          elements: ["Jesus with children", "Disciples watching", "Desert landscape", "Palm trees", "Gentle lamb"]
        }
      ]
    },
    alphabet: {
      title: "Alphabet Adventure",
      description: "Learn letters while coloring fun pictures for each one!",
      pages: [
        {
          title: "A is for Apple",
          description: "A big, juicy apple hanging from a tree branch",
          elements: ["Large letter A", "Red apple", "Apple tree", "Green leaves", "Friendly worm"]
        },
        {
          title: "B is for Butterfly",
          description: "A beautiful butterfly with intricate wing patterns",
          elements: ["Large letter B", "Colorful butterfly", "Flower garden", "Sunny sky", "Other insects"]
        },
        {
          title: "C is for Cat",
          description: "A cute, fluffy cat playing with a ball of yarn",
          elements: ["Large letter C", "Playful cat", "Ball of yarn", "Cat toys", "Cozy cushion"]
        }
      ]
    },
    numbers: {
      title: "Number Fun",
      description: "Count and color your way through numbers 1-10!",
      pages: [
        {
          title: "One Sun",
          description: "One bright, cheerful sun shining in the sky",
          elements: ["Large number 1", "Smiling sun", "Fluffy clouds", "Blue sky", "Rainbow rays"]
        },
        {
          title: "Two Ducks",
          description: "Two friendly ducks swimming in a pond",
          elements: ["Large number 2", "Two ducks", "Pond with lily pads", "Cattails", "Dragonflies"]
        },
        {
          title: "Three Balloons",
          description: "Three colorful balloons floating in the air",
          elements: ["Large number 3", "Three balloons", "Ribbon strings", "Clouds", "Birds flying"]
        }
      ]
    },
    holiday: {
      title: "Holiday Celebrations",
      description: "Celebrate the joy of holidays and special occasions!",
      pages: [
        {
          title: "Christmas Tree",
          description: "A beautiful Christmas tree decorated with ornaments and lights",
          elements: ["Decorated tree", "Colorful ornaments", "Twinkling lights", "Star on top", "Presents underneath"]
        },
        {
          title: "Easter Garden",
          description: "A spring garden celebrating Easter with flowers and new life",
          elements: ["Easter eggs", "Blooming flowers", "Butterflies", "Cross", "Resurrection symbols"]
        },
        {
          title: "Thanksgiving Feast",
          description: "A table set for Thanksgiving with all the traditional foods",
          elements: ["Turkey", "Pumpkins", "Corn", "Autumn leaves", "Grateful family"]
        }
      ]
    }
  };

  const selectedTheme = themes[theme as keyof typeof themes] || themes.animals;
  
  const faithConnections: { [key: number]: string | null } = {
    0: null, // Secular
    1: "God made all things beautiful and good. As you color, think about how wonderful God's creation is!",
    2: "Remember that God loves you and wants you to be creative, just like He was when He made the world!",
    3: "\"In the beginning God created the heavens and the earth.\" - Genesis 1:1. Let's praise God for His amazing creation as we color!"
  };

  const faithLevelMap = {
    0: "Secular",
    1: "Gently Christian", 
    2: "Moderately Christian",
    3: "Richly Biblical"
  };

  const ageGroupMap = {
    toddler: "Toddler (2-4 years)",
    preschool: "Preschool (4-6 years)", 
    elementary: "Elementary (6+ years)"
  };

  const faithLevelNum = parseInt(faithLevel);
  
  return {
    title: selectedTheme.title,
    theme: theme,
    ageGroup: ageGroupMap[ageGroup as keyof typeof ageGroupMap] || ageGroup,
    faithLevel: faithLevelMap[faithLevelNum as keyof typeof faithLevelMap] || "Secular",
    description: selectedTheme.description,
    instructions: "Use your favorite colors to bring these pictures to life! Take your time and enjoy the process of creating something beautiful.",
    coloringPages: selectedTheme.pages.map((page, index) => ({
      id: index + 1,
      title: page.title,
      description: page.description,
      elements: page.elements,
      christianConnection: faithLevelNum > 0 ? faithConnections[faithLevelNum] || undefined : undefined,
      coloringTips: [
        "Try using different shades of the same color for depth",
        "Don't be afraid to use unusual colors - purple trees can be magical!",
        "Add patterns and textures to make your coloring unique",
        "Take breaks and come back with fresh eyes",
        "Remember: your coloring is perfect just the way you make it!"
      ]
    })),
    materials: [
      "Colored pencils",
      "Crayons", 
      "Markers",
      "Gel pens",
      "Watercolor pencils",
      "Blending stumps",
      "Eraser",
      "Creativity and imagination!"
    ]
  };
};
