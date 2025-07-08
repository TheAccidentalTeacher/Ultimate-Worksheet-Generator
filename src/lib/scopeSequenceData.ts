// src/lib/scopeSequenceData.ts
// Default scope & sequence data for common subjects/grades. Admins can edit/expand this file.

export type ScopeSequence = {
  [subject: string]: {
    [grade: string]: string[];
  };
};

export const scopeSequenceData: ScopeSequence = {
  Math: {
    'K': [
      'Counting to 20',
      'Recognizing shapes',
      'Simple addition and subtraction',
      'Comparing numbers',
      'Patterns',
    ],
    '1': [
      'Addition and subtraction within 20',
      'Place value',
      'Measurement',
      'Telling time',
      'Simple word problems',
    ],
    '2': [
      'Addition and subtraction within 100',
      'Introduction to multiplication',
      'Money',
      'Measurement and data',
      'Geometry basics',
    ],
    '3': [
      'Multiplication and division',
      'Fractions',
      'Area and perimeter',
      'Graphs and data',
      'Word problems',
    ],
    '6': [
      'Ratios and proportional relationships',
      'Integers and rational numbers',
      'Algebraic expressions',
      'Geometry: area, surface area, and volume',
      'Statistics and probability',
    ],
    '9': [
      'Algebra I',
      'Functions and equations',
      'Geometry',
      'Financial literacy',
      'Biblical stewardship of resources',
    ],
  },
  Reading: {
    'K': [
      'Letter recognition',
      'Phonemic awareness',
      'Sight words',
      'Listening comprehension',
      'Rhyming',
    ],
    '1': [
      'Decoding words',
      'Reading simple sentences',
      'Comprehension questions',
      'Retelling stories',
      'Vocabulary building',
    ],
    '3': [
      'Classic children’s literature',
      'Reading aloud with expression',
      'Narration and retelling',
      'Christian missionary stories',
      'Scripture memory',
    ],
    '7': [
      'Classic novels and great books',
      'Christian apologetics for youth',
      'Discernment in media and literature',
      'Worldview analysis',
      'Public speaking',
    ],
  },
  Science: {
    'K': [
      'Five senses',
      'Weather',
      'Plants and animals',
      'Simple experiments',
      'Seasons',
    ],
    '3': [
      'Life cycles of plants and animals',
      'Weather and climate basics',
      'Simple machines',
      'Scientific method and experiments',
      'Environmental stewardship',
    ],
    '6': [
      'Creation science vs. evolution',
      'Earth science and stewardship',
      'Human anatomy and health',
      'Christian scientists in history',
      'Biblical view of origins',
    ],
    '9': [
      'Biology with intelligent design',
      'Chemistry basics',
      'Apologetics in science',
      'Bioethics from a Christian worldview',
      'Environmental responsibility',
    ],
  },
  "Christian History & Bible": {
    'K': [
      'Bible stories and heroes',
      'Jesus’ parables',
      'Simple prayers',
      'Christian holidays',
      'Kindness and sharing',
    ],
    '3': [
      'Old and New Testament overviews',
      'Famous missionaries (Gladys Aylward, Hudson Taylor, etc.)',
      'Christian character traits',
      'Scripture memorization',
      'Church history stories',
    ],
    '7': [
      'Reformation and church history',
      'Christian worldview and apologetics',
      'Modern missions',
      'Biblical decision making',
      'Christian citizenship',
    ],
    '12': [
      'Systematic theology basics',
      'Christian apologetics',
      'World religions and cults',
      'Christian influence on Western civilization',
      'Life calling and service',
    ],
  },
  "Life Skills": {
    '3': [
      'Basic cooking and kitchen safety',
      'Simple sewing and mending',
      'Cleaning and organizing',
      'Manners and hospitality',
      'Caring for pets',
    ],
    '6': [
      'Budgeting and money management',
      'Meal planning and nutrition',
      'Basic home repair',
      'Gardening and composting',
      'Time management',
    ],
    '9': [
      'Personal finance and stewardship',
      'Entrepreneurship basics',
      'Car maintenance',
      'Job skills and resume writing',
      'Digital safety and discernment',
    ],
    '12': [
      'Home buying and renting',
      'Insurance and taxes',
      'Christian family and relationships',
      'Leadership and service',
      'Mission trip preparation',
    ],
  },
  "Prepper & Survival Skills": {
    '3': [
      'Basic first aid',
      'Fire safety',
      'Emergency contacts',
      'Stranger danger',
      'Simple outdoor skills',
    ],
    '6': [
      'Wilderness survival basics',
      'Food storage and preservation',
      'Water purification',
      'Map reading and navigation',
      'Storm and disaster preparedness',
    ],
    '9': [
      'Advanced first aid and CPR',
      'Self-defense basics',
      'Firearm safety and marksmanship',
      'Building a go-bag',
      'Community emergency response',
    ],
  },
  "Civics & Constitution": {
    '3': [
      'Pledge of Allegiance',
      'National symbols',
      'Founding fathers',
      'Basic rights and responsibilities',
      'Christian citizenship',
    ],
    '6': [
      'U.S. Constitution and Bill of Rights',
      'Branches of government',
      'Civic duties and voting',
      'Christian influence on America',
      'Patriotic songs and history',
    ],
    '9': [
      'Federalism and states’ rights',
      'Landmark Supreme Court cases',
      'Religious liberty',
      'Current events from a biblical worldview',
      'Public speaking and debate',
    ],
  },
  "Classic Literature": {
    '3': [
      'Aesop’s Fables',
      'Little House on the Prairie',
      'Christian missionary biographies',
      'Poetry memorization',
      'Scripture-based stories',
    ],
    '7': [
      'Pilgrim’s Progress',
      'C.S. Lewis and Tolkien',
      'American and British classics',
      'Biblical themes in literature',
      'Worldview analysis',
    ],
    '12': [
      'Great Books of the Western World',
      'Christian worldview in literature',
      'Shakespeare and the Bible',
      'Modern Christian authors',
      'Literary analysis and apologetics',
    ],
  },
  "Arts & Music": {
    'K': [
      'Singing hymns and worship songs',
      'Basic drawing and coloring',
      'Simple crafts',
      'Movement and rhythm',
      'Listening to classical music',
    ],
    '3': [
      'Learning a musical instrument',
      'Famous Christian artists and composers',
      'Art appreciation',
      'Drama and skits',
      'Hymn history',
    ],
    '7': [
      'Music theory',
      'Art history from a Christian perspective',
      'Worship leading',
      'Creative writing and poetry',
      'Digital art basics',
    ],
  },
  "Physical Fitness & Health": {
    'K': [
      'Basic movement and play',
      'Healthy eating',
      'Personal hygiene',
      'Rest and sleep',
      'Kindness in sports',
    ],
    '3': [
      'Team sports',
      'Fitness routines',
      'Christian view of the body',
      'First aid basics',
      'Outdoor play',
    ],
    '7': [
      'Nutrition and meal planning',
      'Exercise science',
      'Biblical stewardship of health',
      'Sportsmanship',
      'Stress management',
    ],
  },
  "Technology & Digital Discernment": {
    '3': [
      'Basic computer skills',
      'Internet safety',
      'Screen time limits',
      'Christian media choices',
      'Online manners',
    ],
    '7': [
      'Digital citizenship',
      'Cyberbullying prevention',
      'Discernment in technology use',
      'Christian witness online',
      'Basic coding',
    ],
    '12': [
      'Social media and worldview',
      'Digital privacy and security',
      'Christian leadership in tech',
      'Entrepreneurship online',
      'Ethics in technology',
    ],
  },
};

export function getScopeSequence(subject: string, grade: string): string[] | null {
  const subj = scopeSequenceData[subject];
  if (!subj) return null;
  return subj[grade] || null;
}
