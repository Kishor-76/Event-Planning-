import { useState } from 'react'
import { Sparkles, Zap, TrendingUp } from 'lucide-react'

export default function InteractiveBudgetCalculator() {
  const [budget, setBudget] = useState(100000)

  // Budget breakdowns for different budget ranges
  const getBudgetBreakdown = (amount) => {
    return {
      venue: Math.round(amount * 0.30),
      catering: Math.round(amount * 0.35),
      decor: Math.round(amount * 0.15),
      photography: Math.round(amount * 0.12),
      misc: Math.round(amount * 0.08),
    }
  }

  // Get suggestions based on budget
  const getSuggestions = (amount) => {
    if (amount < 50000) {
      return [
        '💒 Intimate venue for 50-100 guests',
        '🍽️ Buffet catering with basic menu',
        '🎨 DIY or minimal decorations',
        '📸 Professional photographer (4 hours)',
        '🎵 DJ with basic setup',
      ]
    } else if (amount < 150000) {
      return [
        '🏰 Elegant venue for 100-200 guests',
        '🍽️ Multi-cuisine catering with premium options',
        '🎨 Professional decorations & floral arrangements',
        '📸 Professional photographer (8 hours)',
        '🎵 Live band or premium DJ with lighting',
      ]
    } else if (amount < 300000) {
      return [
        '✨ Premium luxury venue for 200-500 guests',
        '🍽️ Fine dining catering with specialized chefs',
        '🎨 Elaborate decorations & custom setups',
        '📸 Professional photography & videography',
        '🎵 Live entertainment & sound system',
      ]
    } else {
      return [
        '👑 Exclusive luxury venue for 500+ guests',
        '🍽️ World-class fine dining experience',
        '✨ Extravagant decorations & installations',
        '📸 Professional photography, videography & drone coverage',
        '🎵 Premium live entertainment & orchestra',
      ]
    }
  }

  const breakdown = getBudgetBreakdown(budget)
  const suggestions = getSuggestions(budget)

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN')
  }

  const handleSliderChange = (e) => {
    setBudget(parseInt(e.target.value))
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0
    if (value >= 0 && value <= 1000000) {
      setBudget(value)
    }
  }

  const presetBudgets = [50000, 100000, 200000, 500000, 1000000]

  const budgetTier = 
    budget < 50000 ? 'Budget-Friendly' :
    budget < 150000 ? 'Standard' :
    budget < 300000 ? 'Premium' :
    'Luxury'

  const tierColor =
    budget < 50000 ? 'from-blue-500 to-cyan-500' :
    budget < 150000 ? 'from-purple-500 to-pink-500' :
    budget < 300000 ? 'from-rose-500 to-orange-500' :
    'from-yellow-500 to-red-500'

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden">
      <div className="relative p-8 md:p-12">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl -ml-30 -mb-30" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={32} className="text-yellow-400" />
              <h2 className="text-4xl font-bold text-white">Budget Calculator</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Discover what's possible with your event budget
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input & Budget Tier */}
            <div className="space-y-6">
              {/* Budget Tier Badge */}
              <div className={`bg-gradient-to-r ${tierColor} rounded-2xl p-6 text-white shadow-xl`}>
                <p className="text-sm font-semibold text-white/80 mb-2">Your Budget Tier</p>
                <p className="text-3xl font-bold mb-2">{budgetTier}</p>
                <p className="text-white/90">Perfect for creating memorable moments!</p>
              </div>

              {/* Budget Input */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <label className="block text-white font-semibold mb-4">
                  Total Budget
                </label>

                {/* Slider */}
                <div className="mb-6">
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="5000"
                    value={budget}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((budget - 10000) / (1000000 - 10000)) * 100}%, rgba(255,255,255,0.2) ${((budget - 10000) / (1000000 - 10000)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>₹10k</span>
                    <span>₹1000k</span>
                  </div>
                </div>

                {/* Input Field */}
                <div className="mb-4">
                  <input
                    type="number"
                    value={budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
                    placeholder="Enter budget"
                  />
                </div>

                {/* Display Amount */}
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-1">Your Budget</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {formatCurrency(budget)}
                  </p>
                </div>
              </div>

              {/* Preset Budgets */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Zap size={18} />
                  Quick Select
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {presetBudgets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setBudget(preset)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                        budget === preset
                          ? 'bg-pink-500 text-white shadow-lg'
                          : 'bg-white/20 text-white/80 hover:bg-white/30'
                      }`}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Breakdown & Suggestions */}
            <div className="space-y-6">
              {/* Budget Breakdown */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Budget Breakdown
                </p>

                <div className="space-y-4">
                  {[
                    { label: 'Venue', value: breakdown.venue, color: '#ec4899', percent: 30 },
                    { label: 'Catering', value: breakdown.catering, color: '#f43f5e', percent: 35 },
                    { label: 'Decor', value: breakdown.decor, color: '#a855f7', percent: 15 },
                    { label: 'Photography', value: breakdown.photography, color: '#06b6d4', percent: 12 },
                    { label: 'Misc', value: breakdown.misc, color: '#f59e0b', percent: 8 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-300 font-medium">{item.label}</p>
                        <div className="text-right">
                          <p className="text-white font-bold">{formatCurrency(item.value)}</p>
                          <p className="text-xs text-gray-400">{item.percent}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You Can Do */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-white font-semibold mb-4">With {formatCurrency(budget)}, You Can:</p>
                <div className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <span className="text-xl mt-0.5">✓</span>
                      <span className="text-gray-200">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl border border-white/20 text-center">
            <p className="text-white text-lg font-semibold mb-3">
              Ready to plan your perfect event?
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all transform hover:scale-105">
              Start Planning Now
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          cursor: pointer;
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.6);
          border: 3px solid white;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          cursor: pointer;
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.6);
          border: 3px solid white;
        }
      `}</style>
    </div>
  )
}
