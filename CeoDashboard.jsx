import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CeoDashboard = () => {
  const [staffReports, setStaffReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Flask on mount
  useEffect(() => {
    const fetchReports = async () => {
  try {
    const token = localStorage.getItem('kpi_token'); // Get the key
    const response = await axios.get('http://localhost:5000/api/v1/reports', {
      headers: {
        'Authorization': `Bearer ${token}` // Show the key to Flask
      }
    });
    setStaffReports(response.data);
  } catch (error) {
    console.error("Error fetching reports:", error);
  } finally {
    setIsLoading(false);
  }
};

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Overview */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-zinc-800 bg-zinc-900/30 p-6">
        <h1 className="text-xl font-bold tracking-widest uppercase text-zinc-100 mb-8">Randaframes <span className="text-zinc-500">HQ</span></h1>
        
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Recent Submissions</h2>
        
        {isLoading ? (
          <p className="text-sm text-zinc-600 animate-pulse">Loading database records...</p>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[80vh] pr-2">
            {staffReports.map(report => (
              <button 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="w-full text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors flex justify-between items-center group"
              >
                <div>
                  <p className="font-medium text-sm">{report.name}</p>
                  <p className="text-xs text-zinc-500">{report.dept}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${report.ai_score >= 7 ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                  {report.ai_score}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Drill-down View */}
      <div className="flex-1 p-8 md:p-12">
        {selectedReport ? (
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-end justify-between border-b border-zinc-800 pb-6 mb-8">
              <div>
                <h2 className="text-3xl font-semibold">{selectedReport.name}</h2>
                <p className="text-zinc-500 mt-1">{selectedReport.dept} Department</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">AI Evaluation</p>
                <p className="text-6xl font-bold tracking-tighter">
                  {selectedReport.ai_score}<span className="text-2xl text-zinc-600">/10</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Raw Description</h3>
                <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedReport.description}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-600">
            <p>Select a staff report to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CeoDashboard;