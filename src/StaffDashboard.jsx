import React, { useState } from 'react';

const StaffDashboard = () => {
  const [formData, setFormData] = useState({
    qna1: '',
    qna2: '',
    dailyDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating the API call to your Flask backend
    try {
      const response = await fetch('http://localhost:5000/api/v1/reports/submit', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('kpi_token')}` // Show the key
  },
  body: JSON.stringify({
    // Note: No need to pass staff_id anymore! Flask gets it securely from the token.
    qna_responses: { 
      "Biggest blocker today?": formData.qna1, 
      "Main focus for tomorrow?": formData.qna2 
    },
    daily_description: formData.dailyDescription
  })
});
      
      const data = await response.json();
      setAiResult(data.ai_score);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8">
        
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-semibold text-white tracking-wide">Daily Report</h1>
          <p className="text-sm text-zinc-500 mt-1">Submit your end-of-day report.</p>
        </header>

        {aiResult ? (
          <div className="text-center py-12">
            <h2 className="text-5xl font-bold text-white mb-4">{aiResult}<span className="text-2xl text-zinc-600">/10</span></h2>
            <p className="text-zinc-400">Report evaluated and sent to the Admin dashboard.</p>
            <button 
              onClick={() => setAiResult(null)}
              className="mt-6 px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 transition-colors"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">What was your biggest issue faced today?</label>
                <input 
                  type="text" 
                  value={formData.qna1}
                  onChange={(e) => setFormData({...formData, qna1: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Pending tasks for tomorrow?</label>
                <input 
                  type="text" 
                  value={formData.qna2}
                  onChange={(e) => setFormData({...formData, qna2: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Detailed Daily Report</label>
                <textarea 
                  rows="5"
                  value={formData.dailyDescription}
                  onChange={(e) => setFormData({...formData, dailyDescription: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  placeholder="Outline your tasks, commits, and resolved issues..."
                  required
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Evaluating via AI...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;