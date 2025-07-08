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
import ColoringSheetGenerator from '@/components/ColoringSheetGenerator';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedColoringTheme, setSelectedColoringTheme] = useState('');
  const [selectedColoringAge, setSelectedColoringAge] = useState('');
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
  const [showColoringGenerator, setShowColoringGenerator] = useState(false);
  const [activeTab, setActiveTab] = useState('coloring'); // Start with coloring as default!

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

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('worksheets')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'worksheets'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Worksheets</span>
              </button>
              <button
                onClick={() => setActiveTab('coloring')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'coloring'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                <span className="text-lg">🎨</span>
                <span>Coloring Sheets</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {activeTab === 'worksheets' ? (
            <>
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
            </>
          ) : (
            /* Coloring Sheets Section - Now the MAIN focus! */
            <>
              <div className="lg:col-span-3 space-y-8">
                {/* Hero Section for Coloring */}
                <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 border-4 border-pink-200 shadow-2xl relative overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-4 left-4 text-4xl opacity-20 animate-bounce">🎨</div>
                  <div className="absolute top-8 right-8 text-3xl opacity-20 animate-pulse">🌈</div>
                  <div className="absolute bottom-4 left-8 text-3xl opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
                  <div className="absolute bottom-8 right-4 text-4xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}>🖍️</div>
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
                          <span className="text-4xl">🎨</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
                          <Sparkles className="h-5 w-5 text-yellow-700" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 bg-pink-400 rounded-full p-2 shadow-lg animate-pulse">
                          <Heart className="h-5 w-5 text-pink-700" />
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                      Create 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        {" "}Magical
                      </span>
                      <br />
                      Coloring Adventures!
                    </h2>
                    
                    <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                      Design beautiful, whimsical coloring pages that spark creativity and joy! 
                      Every page is crafted with love to bring out your child's artistic spirit. ✨
                    </p>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 shadow-lg">
                      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🎭</span>
                          <span className="font-semibold">Hand-crafted designs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🌈</span>
                          <span className="font-semibold">Whimsical & fun</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🙏</span>
                          <span className="font-semibold">Faith-friendly options</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🖨️</span>
                          <span className="font-semibold">Print-ready PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coloring Sheet Creator */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-full">
                        <span className="text-3xl">🎨</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">Design Your Coloring Book</h3>
                        <p className="text-gray-600">Choose your theme and let the magic begin!</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Theme Selection - Much more prominent */}
                    <div>
                      <label className="block text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl">1️⃣</span>
                        </div>
                        Pick Your Magical Theme
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                          { 
                            id: 'animals', 
                            emoji: '🦁', 
                            label: 'Amazing Animals', 
                            desc: 'Lions, elephants, dolphins & more!',
                            color: 'from-orange-400 to-red-400'
                          },
                          { 
                            id: 'nature', 
                            emoji: '🌸', 
                            label: 'Nature Wonder', 
                            desc: 'Flowers, trees, rainbows & gardens',
                            color: 'from-green-400 to-blue-400'
                          },
                          { 
                            id: 'bible', 
                            emoji: '⛪', 
                            label: 'Bible Adventures', 
                            desc: 'Biblical stories & characters',
                            color: 'from-purple-400 to-pink-400'
                          },
                          { 
                            id: 'alphabet', 
                            emoji: '🔤', 
                            label: 'Alphabet Fun', 
                            desc: 'A is for Apple, B is for Bear...',
                            color: 'from-yellow-400 to-orange-400'
                          },
                          { 
                            id: 'numbers', 
                            emoji: '🔢', 
                            label: 'Number Magic', 
                            desc: 'Count and color 1 through 10',
                            color: 'from-blue-400 to-purple-400'
                          },
                          { 
                            id: 'holiday', 
                            emoji: '🎄', 
                            label: 'Holiday Joy', 
                            desc: 'Christmas, Easter & celebrations',
                            color: 'from-red-400 to-green-400'
                          }
                        ].map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedColoringTheme(theme.id)}
                            className={`group p-6 rounded-2xl border-3 transition-all text-center transform hover:scale-105 ${
                              selectedColoringTheme === theme.id
                                ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl scale-105'
                                : 'border-gray-200 bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 hover:border-pink-300'
                            }`}
                          >
                            <div className={`text-5xl mb-4 ${selectedColoringTheme === theme.id ? 'animate-bounce' : ''}`}>
                              {theme.emoji}
                            </div>
                            <div className={`font-bold text-lg mb-2 ${selectedColoringTheme === theme.id ? 'text-pink-800' : 'text-gray-800'}`}>
                              {theme.label}
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">{theme.desc}</div>
                            {selectedColoringTheme === theme.id && (
                              <div className="mt-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xs font-bold py-2 px-4 rounded-full">
                                ✨ Selected ✨
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age Group Selection - Enhanced */}
                    <div>
                      <label className="block text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl">2️⃣</span>
                        </div>
                        Choose Age Group
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { 
                            value: 'toddler', 
                            emoji: '👶',
                            label: 'Little Artists', 
                            age: '(2-4 years)',
                            desc: 'Simple, large designs perfect for tiny hands',
                            features: ['Bold outlines', 'Large spaces', 'Simple shapes']
                          },
                          { 
                            value: 'preschool', 
                            emoji: '🧒',
                            label: 'Young Creators', 
                            age: '(4-6 years)',
                            desc: 'Fun and engaging with more detail',
                            features: ['Medium detail', 'Fun characters', 'Learning elements']
                          },
                          { 
                            value: 'elementary', 
                            emoji: '👧',
                            label: 'Artistic Explorers', 
                            age: '(6+ years)',
                            desc: 'Detailed designs for developing skills',
                            features: ['Fine details', 'Complex patterns', 'Creative challenges']
                          }
                        ].map(age => (
                          <button
                            key={age.value}
                            onClick={() => setSelectedColoringAge(age.value)}
                            className={`group p-6 rounded-2xl border-3 transition-all text-left transform hover:scale-105 ${
                              selectedColoringAge === age.value
                                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl scale-105'
                                : 'border-gray-200 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center mb-4">
                              <span className={`text-3xl mr-3 ${selectedColoringAge === age.value ? 'animate-bounce' : ''}`}>
                                {age.emoji}
                              </span>
                              <div>
                                <div className={`font-bold text-lg ${selectedColoringAge === age.value ? 'text-purple-800' : 'text-gray-800'}`}>
                                  {age.label}
                                </div>
                                <div className="text-sm text-gray-600">{age.age}</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">{age.desc}</div>
                            <div className="space-y-1">
                              {age.features.map((feature, i) => (
                                <div key={i} className="flex items-center text-xs text-gray-500">
                                  <span className="mr-2">✨</span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                            {selectedColoringAge === age.value && (
                              <div className="mt-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs font-bold py-2 px-4 rounded-full text-center">
                                ✨ Perfect Choice! ✨
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Faith Level - Enhanced */}
                    <div>
                      <label className="block text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                          <Heart className="h-6 w-6 text-rose-600" />
                        </div>
                        Faith & Values Level
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: 0, emoji: '🌈', label: 'Secular Fun', desc: 'Pure creativity & joy' },
                          { value: 1, emoji: '✨', label: 'Gentle Values', desc: 'Wholesome & positive' },
                          { value: 2, emoji: '🙏', label: 'Faith-Friendly', desc: 'Christian themes woven in' },
                          { value: 3, emoji: '⛪', label: 'Biblical Focus', desc: 'Rich in scripture & faith' }
                        ].map(level => (
                          <button
                            key={level.value}
                            onClick={() => setChristianContent(level.value)}
                            className={`group p-4 rounded-xl border-3 transition-all text-center transform hover:scale-105 ${
                              christianContent === level.value
                                ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg scale-105'
                                : 'border-gray-200 bg-white hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 hover:border-rose-300'
                            }`}
                          >
                            <div className={`text-3xl mb-2 ${christianContent === level.value ? 'animate-pulse' : ''}`}>
                              {level.emoji}
                            </div>
                            <div className={`text-sm font-bold mb-1 ${christianContent === level.value ? 'text-rose-800' : 'text-gray-800'}`}>
                              {level.label}
                            </div>
                            <div className="text-xs text-gray-600">{level.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button - Make it AMAZING */}
                    <div className="pt-8 text-center">
                      <button 
                        onClick={() => {
                          if (selectedColoringTheme && selectedColoringAge) {
                            setShowColoringGenerator(true);
                          }
                        }}
                        disabled={!selectedColoringTheme || !selectedColoringAge}
                        className={`group relative px-12 py-6 rounded-3xl font-bold text-2xl transition-all shadow-2xl transform ${
                          selectedColoringTheme && selectedColoringAge
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-105 animate-pulse'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-4">
                          <span className="text-3xl">🎨</span>
                          <span>Create My Magical Coloring Book!</span>
                          <Sparkles className="h-8 w-8" />
                        </div>
                        
                        {selectedColoringTheme && selectedColoringAge && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-30 group-hover:opacity-50 animate-pulse"></div>
                        )}
                      </button>
                      
                      {(!selectedColoringTheme || !selectedColoringAge) && (
                        <p className="mt-4 text-gray-500 text-sm">
                          👆 Please select a theme and age group to continue
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show the coloring generator */}
                {showColoringGenerator && selectedColoringTheme && selectedColoringAge && (
                  <ColoringSheetGenerator
                    theme={selectedColoringTheme}
                    ageGroup={selectedColoringAge}
                    faithLevel={christianContent}
                  />
                )}
              </div>
            </>
          )}
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
