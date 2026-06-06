import { useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Edit2, TrendingUp } from 'lucide-react'

export default function BudgetTracker() {
  const [budgetData, setBudgetData] = useState([
    { name: 'Catering', value: 45000, color: '#ec4899' },
    { name: 'Venue', value: 60000, color: '#f43f5e' },
    { name: 'Decor', value: 35000, color: '#a855f7' },
    { name: 'Photography', value: 25000, color: '#06b6d4' },
    { name: 'Music & Entertainment', value: 30000, color: '#8b5cf6' },
    { name: 'Invitations', value: 8000, color: '#f59e0b' },
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editAmount, setEditAmount] = useState('')

  const colors = ['#ec4899', '#f43f5e', '#a855f7', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#6366f1']

  // Calculate totals
  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)
  const averageSpend = Math.round(totalBudget / budgetData.length)
  const largestExpense = budgetData.reduce((max, item) => item.value > max.value ? item : max)

  const handleAddCategory = () => {
    if (newCategory && newAmount) {
      const colorIndex = budgetData.length % colors.length
      setBudgetData([
        ...budgetData,
        {
          name: newCategory,
          value: parseInt(newAmount),
          color: colors[colorIndex],
        },
      ])
      setNewCategory('')
      setNewAmount('')
      setIsEditing(false)
    }
  }

  const handleEditAmount = (index, newValue) => {
    const updated = [...budgetData]
    updated[index].value = parseInt(newValue)
    setBudgetData(updated)
    setEditingIndex(null)
  }

  const handleDeleteCategory = (index) => {
    setBudgetData(budgetData.filter((_, i) => i !== index))
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / totalBudget) * 100).toFixed(1)
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-700">₹{data.value.toLocaleString()}</p>
          <p className="text-sm font-semibold text-rose-600">{percentage}% of budget</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Main Pie Chart Card */}
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Budget Breakdown</h2>
        <p className="text-gray-600 mb-8">Total Budget: <span className="font-bold text-rose-600">₹{totalBudget.toLocaleString()}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Stats */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200">
                <p className="text-sm font-semibold text-rose-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-rose-700">₹{totalBudget.toLocaleString()}</p>
                <p className="text-xs text-rose-600 mt-1">{budgetData.length} categories</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
                <p className="text-sm font-semibold text-purple-600 mb-1">Average Spend</p>
                <p className="text-2xl font-bold text-purple-700">₹{averageSpend.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">Per category</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-200 col-span-2">
                <p className="text-sm font-semibold text-cyan-600 mb-1">Largest Expense</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-cyan-700">{largestExpense.name}</p>
                  <p className="text-lg font-bold text-cyan-700">₹{largestExpense.value.toLocaleString()}</p>
                </div>
                <p className="text-xs text-cyan-600 mt-1">{((largestExpense.value / totalBudget) * 100).toFixed(1)}% of budget</p>
              </div>
            </div>

            {/* Budget Health */}
            <div className="bg-white/50 rounded-xl p-4 border border-white">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={20} className="text-emerald-600" />
                <span className="font-semibold text-gray-900">Budget Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Allocated</span>
                  <span className="font-bold text-gray-900">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-purple-500" style={{width: '100%'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories List */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Budget Categories</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-all"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Add Category Form */}
        {isEditing && (
          <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNewCategory('')
                    setNewAmount('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="space-y-3">
          {budgetData.map((item, index) => {
            const percentage = ((item.value / totalBudget) * 100).toFixed(1)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Color Dot */}
                  <div
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* Category Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-xs overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4 ml-4">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        onClick={() => handleEditAmount(index, editAmount)}
                        className="px-2 py-1 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-gray-900 min-w-24 text-right">₹{item.value.toLocaleString()}</p>
                      <button
                        onClick={() => {
                          setEditingIndex(index)
                          setEditAmount(item.value)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all"
                        title="Edit amount"
                      >
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
                        title="Delete category"
                      >
                        <span className="text-red-600 font-bold text-lg">✕</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200">
        <h3 className="text-xl font-bold text-amber-900 mb-4">Budget Tips</h3>
        <ul className="space-y-2 text-amber-800">
          <li className="flex gap-3">
            <span className="font-bold text-lg">💡</span>
            <span>Allocate 40% for venue, 30% for catering, and 20% for other essentials</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-lg">💡</span>
            <span>Keep 10% as a contingency fund for unexpected expenses</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-lg">💡</span>
            <span>Track expenses regularly to stay within your budget</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
