'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  User, 
  Settings, 
  History, 
  Plus, 
  ChevronDown, 
  Search,
  Users,
  Heart,
  Star,
  Target,
  Sparkles,
  Sliders,
  Download,
  Eye,
  Lightbulb,
  LogOut
} from 'lucide-react';
import WorksheetGenerator from '@/components/WorksheetGenerator';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [numProblems, setNumProblems] = useState(10);
  const [scaffolding, setScaffolding] = useState('none');
  const [differentiation, setDifferentiation] = useState('standard');
  const [christianContent, setChristianContent] = useState(2);
  const [worksheetStyle, setWorksheetStyle] = useState('whimsical');
  const [timeEstimate, setTimeEstimate] = useState('medium');
  const [printFormat, setPrintFormat] = useState('full-page');
  const [selectedState, setSelectedState] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWorksheetGenerator, setShowWorksheetGenerator] = useState(false);

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleGenerateWorksheet = () => {
    if (!selectedGrade || !selectedSubject) {
      alert('Please select at least a grade level and subject before generating a worksheet.');
      return;
    }
    setShowWorksheetGenerator(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const gradeOptions = [
    'Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
    '7th', '8th', '9th', '10th', '11th', '12th', 'Multi-Age', 'Custom'
  ];

  const subjectGroups = {
    'Core Academics': ['Math', 'ELA/Language Arts', 'Science', 'Social Studies', 'History'],
    'Enrichment': ['Art', 'Music', 'Physical Education', 'Technology', 'Foreign Languages'],
    'Life Skills': ['Financial Literacy', 'Home Economics', 'Gardening', 'Cooking', 'Time Management'],
    'Bible & Christian Studies': ['Bible Study', 'Christian Living', 'Apologetics', 'Church History', 'Theology']
  };

  const christianContentLevels = [
    { value: 0, label: 'Secular', desc: 'No explicit Christian content' },
    { value: 1, label: 'Gentle', desc: 'Occasional scripture, positive worldview' },
    { value: 2, label: 'Moderate', desc: 'Regular biblical integration' },
    { value: 3, label: 'Rich', desc: 'Scripture, faith integration throughout' }
  ];

  const worksheetStyles = [
    { value: 'whimsical', label: 'Whimsical', desc: 'Playful, colorful, fun illustrations' },
    { value: 'minimalist', label: 'Minimalist', desc: 'Clean, simple, focused design' },
    { value: 'classic', label: 'Classic', desc: 'Traditional, structured layout' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-3xl animate-bounce mx-auto mb-4">
            🦉
          </div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-xl">
                🦉
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  WorksheetWise
                </h1>
                <p className="text-xs text-gray-600">Your AI Learning Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <History className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 rounded-full transition-colors group"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-amber-200">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-amber-700 font-medium">Ready to create something amazing?</span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Magical Worksheet Creator</h2>
          <p className="text-lg text-gray-600">Let's craft the perfect learning adventure for your precious ones! ✨</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-full">
                  <Plus className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Customization Panel</h3>
              </div>
              <button 
                onClick={() => setShowCustomization(!showCustomization)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                {showCustomization ? 'Hide Options' : 'Show All Options'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Grade Level */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  Select Grade Level
                </label>
                <select 
                  value={selectedGrade} 
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                >
                  <option value="">Choose a grade level...</option>
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  Choose Subject
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(subjectGroups).map(([groupName, subjects]) => (
                    <div key={groupName} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">{groupName}</h4>
                      <div className="space-y-2">
                        {subjects.map(subject => (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-all ${ 
                              selectedSubject === subject 
                                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' 
                                : 'bg-white hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Search */}
              {selectedSubject && (
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    Specific Topic
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      placeholder="e.g., Fractions, Parts of Speech, Weather..."
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Number of Problems */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-orange-600">4</span>
                  </div>
                  Number of Problems/Activities
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={numProblems}
                      onChange={(e) => setNumProblems(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="bg-amber-100 px-4 py-2 rounded-full font-semibold text-amber-800">
                      {numProblems}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-2">
                      {[...Array(Math.min(numProblems, 10))].map((_, i) => (
                        <div key={i} className="w-3 h-4 bg-amber-300 rounded-sm"></div>
                      ))}
                      {numProblems > 10 && (
                        <span className="text-amber-600 font-medium">+{numProblems - 10}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Christian Content Slider */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                    <Heart className="h-4 w-4 text-rose-600" />
                  </div>
                  Christian Content Level
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Secular</span>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={christianContent}
                      onChange={(e) => setChristianContent(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">Richly Biblical</span>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-5 w-5 text-rose-600" />
                      <span className="font-semibold text-rose-800">
                        {christianContentLevels[christianContent].label}
                      </span>
                    </div>
                    <p className="text-sm text-rose-700">
                      {christianContentLevels[christianContent].desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Worksheet Style */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  Worksheet Style
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {worksheetStyles.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setWorksheetStyle(style.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${ 
                        worksheetStyle === style.value 
                          ? 'border-indigo-300 bg-indigo-50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {style.value === 'whimsical' ? '🎨' : style.value === 'minimalist' ? '⚪' : '📄'}
                      </div>
                      <div className="font-semibold text-gray-800">{style.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-6">
                <button 
                  onClick={handleGenerateWorksheet}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <Sparkles className="h-6 w-6" />
                  <span>Create My Magical Worksheet!</span>
                  <Star className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                Helpful Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✨</span>
                  Be specific about what you want to focus on
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✨</span>
                  Choose the right Christian content level for your family
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✨</span>
                  Consider your child's attention span when selecting problems
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✨</span>
                  Whimsical style works great for younger learners!
                </li>
              </ul>
            </div>

            {/* Popular Combinations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 text-green-500 mr-2" />
                Popular This Week
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="font-medium text-green-900 text-sm">3rd Grade Math + Bible</div>
                  <div className="text-xs text-green-700">Multiplication with biblical stories</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="font-medium text-green-900 text-sm">Science + Creation</div>
                  <div className="text-xs text-green-700">Animals with Genesis integration</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="font-medium text-green-900 text-sm">Reading Comprehension</div>
                  <div className="text-xs text-green-700">Christian character stories</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <History className="h-5 w-5 text-purple-500 mr-2" />
                Your Recent Creations
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium text-purple-900 text-sm">4th Grade Science</div>
                  <div className="text-xs text-purple-700">Created 2 hours ago</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium text-purple-900 text-sm">2nd Grade Math</div>
                  <div className="text-xs text-purple-700">Created yesterday</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium text-purple-900 text-sm">Bible Study</div>
                  <div className="text-xs text-purple-700">Created 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Worksheet Generator Modal/Panel */}
      {showWorksheetGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
                Your Magical Worksheet
              </h2>
              <button
                onClick={() => setShowWorksheetGenerator(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <WorksheetGenerator
                customization={{
                  grade: selectedGrade,
                  subject: selectedSubject,
                  topic: selectedTopic,
                  numProblems: numProblems,
                  scaffolding: scaffolding,
                  differentiation: differentiation,
                  christianContent: christianContent,
                  worksheetStyle: worksheetStyle,
                  timeEstimate: timeEstimate,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
