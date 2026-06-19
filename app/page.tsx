'use client';

import { useState, useEffect } from 'react';

interface LotteryGame {
  id: string;
  name: string;
  mainCount: number;
  mainMax: number;
  hasBonus: boolean;
  bonusCount: number;
  bonusMax: number | null;
}

interface GeneratedNumber {
  main: number[];
  bonus: number[];
  uniqueness: {
    score: number;
    warnings: string[];
  };
}

export default function Home() {
  const [games, setGames] = useState<LotteryGame[]>([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [includeNumbers, setIncludeNumbers] = useState('');
  const [excludeNumbers, setExcludeNumbers] = useState('');
  const [lines, setLines] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedNumber[]>([]);
  const [error, setError] = useState('');

  // Load games when page opens
  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        setGames(data);
        if (data.length > 0) {
          setSelectedGame(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load games:', err);
        setError('Failed to load lottery games');
      }
    }
    loadGames();
  }, []);

  // Generate numbers
  const generateNumbers = async () => {
    if (!selectedGame) {
      setError('Please select a lottery game');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Parse include/exclude numbers
      const include = includeNumbers
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));
      
      const exclude = excludeNumbers
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: selectedGame,
          includeNumbers: include,
          excludeNumbers: exclude,
          lines: lines
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.numbers);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate numbers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get selected game details
  const selectedGameDetails = games.find(g => g.id === selectedGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            🎲 Lottery Number Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Generate unique lottery numbers with high uniqueness scores
          </p>
        </div>

        {/* Main Generator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Generator Settings</h2>
          
          {/* Game Selection */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Select Lottery Game
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {games.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name} - Pick {game.mainCount} numbers from 1-{game.mainMax}
                  {game.hasBonus && ` + ${game.bonusCount} bonus from 1-${game.bonusMax}`}
                </option>
              ))}
            </select>
          </div>

          {/* Include/Exclude Numbers */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Include These Numbers (Optional)
              </label>
              <input
                type="text"
                value={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.value)}
                placeholder="e.g., 7, 13, 22"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">These numbers will be in every line</p>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Exclude These Numbers (Optional)
              </label>
              <input
                type="text"
                value={excludeNumbers}
                onChange={(e) => setExcludeNumbers(e.target.value)}
                placeholder="e.g., 4, 11, 19"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">These numbers will never appear</p>
            </div>
          </div>

          {/* Lines Slider */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Number of Lines: {lines}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={lines}
              onChange={(e) => setLines(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 line</span>
              <span>5 lines</span>
              <span>10 lines</span>
              <span>15 lines</span>
              <span>20 lines</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateNumbers}
            disabled={loading || !selectedGame}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '🎲 Generating...' : '✨ Generate Lucky Numbers ✨'}
          </button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Lucky Numbers</h2>
            
            {results.map((line, idx) => (
              <div key={idx} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-600">Line {idx + 1}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    line.uniqueness.score > 70 ? 'bg-green-100 text-green-700' :
                    line.uniqueness.score > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Uniqueness: {line.uniqueness.score}%
                  </div>
                </div>
                
                {/* Main Numbers */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {line.main.map((num, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-lg transform hover:scale-110 transition-transform"
                    >
                      {num}
                    </div>
                  ))}
                  {line.bonus.map((num, i) => (
                    <div
                      key={`bonus-${i}`}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg transform hover:scale-110 transition-transform"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                
                {/* Warnings */}
                {line.uniqueness.warnings.length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ {line.uniqueness.warnings.join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Export Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const csvContent = results.map((line, idx) => {
                    return `Line ${idx + 1},${line.main.join(',')},${line.bonus.join(',')},Score: ${line.uniqueness.score}%`;
                  }).join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `lottery-numbers-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                📥 Export to CSV
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {selectedGameDetails && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ About {selectedGameDetails.name}</h3>
            <p className="text-sm text-blue-700">
              Pick {selectedGameDetails.mainCount} numbers from 1 to {selectedGameDetails.mainMax}
              {selectedGameDetails.hasBonus && ` plus ${selectedGameDetails.bonusCount} bonus number(s) from 1 to ${selectedGameDetails.bonusMax}`}.
              Total possible combinations: Millions!
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>⚠️ This tool generates random numbers with uniqueness scoring to avoid common patterns.</p>
          <p className="mt-1">Lotteries are games of chance. No strategy guarantees winning. Please play responsibly.</p>
        </div>
      </div>
    </div>
  );
}