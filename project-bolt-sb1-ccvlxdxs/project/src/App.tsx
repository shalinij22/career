import React, { useState, useEffect } from 'react';
import { Brain, Send, Share2, ArrowLeft } from 'lucide-react';
import { questions } from './data/questions';
import { getCareerRecommendations } from './utils/recommendations';

type FormData = {
  [key: string]: string;
};

function App() {
  const [formData, setFormData] = useState<FormData>({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    // Check for URL parameters on load
    const params = new URLSearchParams(window.location.search);
    const savedData: FormData = {};
    let hasData = false;

    questions.forEach(question => {
      const value = params.get(question.id);
      if (value) {
        savedData[question.id] = value;
        hasData = true;
      }
    });

    if (hasData) {
      setFormData(savedData);
      const results = getCareerRecommendations(savedData);
      setRecommendations(results);
      setShowRecommendations(true);
    }
  }, []);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const results = getCareerRecommendations(formData);
    setRecommendations(results);
    setShowRecommendations(true);
    
    // Generate shareable URL
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      params.set(key, value);
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setShareUrl(url);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const isFormComplete = Object.keys(formData).length === questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-700 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain size={48} className="text-indigo-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-200">Path Uncover</h1>
          <h2 className="text-2xl md:text-3xl mb-4">AI-Powered Career Selector</h2>
          <p className="text-lg text-indigo-200">Uncover the clarity you need to succeed</p>
        </header>

        <main className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
          {!showRecommendations ? (
            <div>
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
                <Brain size={24} />
                Complete the Questionnaire
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label className="block text-lg font-medium text-indigo-200">
                      {question.label}
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-indigo-300/30 
                               text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    >
                      <option value="" disabled>Choose an option</option>
                      {question.options.map((option) => (
                        <option key={option.value} value={option.value} className="text-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={!isFormComplete}
                  className={`w-full mt-8 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold
                            transition-all duration-200 ${
                              isFormComplete
                                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                : 'bg-indigo-600/50 cursor-not-allowed'
                            }`}
                >
                  <Send size={20} />
                  Get Recommendations
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">✨ Your Career Recommendations</h2>
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                           transition-all duration-200 text-sm font-semibold"
                >
                  <Share2 size={16} />
                  Share Results
                </button>
              </div>
              <div className="space-y-6">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-white/20 backdrop-blur-sm border border-indigo-300/30"
                    dangerouslySetInnerHTML={{ __html: recommendation }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setShowRecommendations(false);
                  setFormData({});
                  setShareUrl('');
                  // Remove URL parameters
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="w-full px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                         transition-all duration-200 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Start Over
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;