import { useState } from 'react'
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'

export default function PlanningProgressRing({ completionPercentage = 65, eventType = 'Wedding' }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Venue Booked', completed: true },
    { id: 2, name: 'Catering Arranged', completed: true },
    { id: 3, name: 'Guest List Finalized', completed: true },
    { id: 4, name: 'Decorations Planned', completed: false },
    { id: 5, name: 'Photography Confirmed', completed: false },
    { id: 6, name: 'Music & Entertainment', completed: false },
    { id: 7, name: 'Invitations Sent', completed: true },
    { id: 8, name: 'Transportation Arranged', completed: true },
    { id: 9, name: 'Timeline Finalized', completed: false },
    { id: 10, name: 'Contingency Plans', completed: false },
  ])

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const calculatedPercentage = Math.round((completedTasks / totalTasks) * 100)

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // SVG Circle Progress
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (calculatedPercentage / 100) * circumference

  return (
    <div className="space-y-8">
      {/* Main Progress Ring Card */}
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/60 flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg width="240" height="240" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              {calculatedPercentage}%
            </span>
            <span className="text-xs font-semibold text-gray-600 mt-1">Complete</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {eventType} Planning Progress
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            You've completed <span className="font-bold text-rose-600">{completedTasks} out of {totalTasks}</span> planning tasks
          </p>

          {/* Progress Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="text-gray-700 font-medium">Completed: <span className="font-bold">{completedTasks}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Circle size={20} className="text-gray-400" />
              <span className="text-gray-700 font-medium">Pending: <span className="font-bold">{totalTasks - completedTasks}</span></span>
            </div>
            {calculatedPercentage === 100 ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg mt-4">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span className="text-emerald-700 font-medium">🎉 All set! Your event is fully planned!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg mt-4">
                <AlertCircle size={20} className="text-amber-600" />
                <span className="text-amber-700 font-medium">Complete {totalTasks - completedTasks} more tasks to finalize</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Checklist */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Planning Checklist</h3>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium text-sm hover:bg-rose-600 transition-all">
            All Tasks ({totalTasks})
          </button>
          <button className="px-4 py-2 bg-white/60 text-gray-700 rounded-lg font-medium text-sm hover:bg-white/80 transition-all">
            Completed ({completedTasks})
          </button>
          <button className="px-4 py-2 bg-white/60 text-gray-700 rounded-lg font-medium text-sm hover:bg-white/80 transition-all">
            Pending ({totalTasks - completedTasks})
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left font-medium ${
                task.completed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white/60 border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <Circle size={24} className="text-gray-400 flex-shrink-0" />
              )}
              <span className={task.completed ? 'line-through text-emerald-600' : ''}>
                {task.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
          <p className="text-sm font-semibold text-rose-600 mb-2">Tasks Done</p>
          <p className="text-3xl font-bold text-rose-700">{completedTasks}</p>
          <p className="text-xs text-rose-600 mt-2">Out of {totalTasks} total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <p className="text-sm font-semibold text-purple-600 mb-2">Tasks Left</p>
          <p className="text-3xl font-bold text-purple-700">{totalTasks - completedTasks}</p>
          <p className="text-xs text-purple-600 mt-2">Keep going!</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <p className="text-sm font-semibold text-emerald-600 mb-2">Progress</p>
          <p className="text-3xl font-bold text-emerald-700">{calculatedPercentage}%</p>
          <p className="text-xs text-emerald-600 mt-2">Almost done!</p>
        </div>
      </div>
    </div>
  )
}
