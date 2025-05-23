"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, Leaf, Droplet, Wind, Plus, Check, X, Moon, Sun, Menu } from "lucide-react"

interface Tip {
  id: number
  title: string
  description: string
  category: "zeroWaste" | "energy" | "water" | "transport"
  likes: number
  author: string
}

interface Challenge {
  id: number
  title: string
  description: string
  category: "zeroWaste" | "energy" | "water" | "transport"
  duration: string
  participants: number
  completed: number
}

interface Progress {
  date: string
  tipsCompleted: number
  challengesCompleted: number
  carbonSaved: number
  waterSaved: number
  wasteReduced: number
}

interface Habit {
  id: number
  name: string
  category: "zeroWaste" | "energy" | "water" | "transport"
  completed: boolean
}

interface NewTip {
  title: string
  description: string
  category: "zeroWaste" | "energy" | "water" | "transport"
}

interface NewChallenge {
  title: string
  description: string
  category: "zeroWaste" | "energy" | "water" | "transport"
  duration: string
}

interface NewHabit {
  name: string
  category: "zeroWaste" | "energy" | "water" | "transport"
}

interface UserInput {
  newTip: NewTip
  newChallenge: NewChallenge
  newHabit: NewHabit
  habits: Habit[]
  selectedTips: number[]
  selectedChallenges: number[]
}

const initialProgress: Progress[] = [
  { date: "2024-09-01", tipsCompleted: 2, challengesCompleted: 1, carbonSaved: 120, waterSaved: 50, wasteReduced: 8 },
  { date: "2024-09-02", tipsCompleted: 5, challengesCompleted: 2, carbonSaved: 250, waterSaved: 80, wasteReduced: 15 },
  { date: "2024-09-03", tipsCompleted: 7, challengesCompleted: 3, carbonSaved: 320, waterSaved: 120, wasteReduced: 22 },
  {
    date: "2024-09-04",
    tipsCompleted: 10,
    challengesCompleted: 5,
    carbonSaved: 450,
    waterSaved: 180,
    wasteReduced: 30,
  },
  {
    date: "2024-09-05",
    tipsCompleted: 12,
    challengesCompleted: 6,
    carbonSaved: 520,
    waterSaved: 220,
    wasteReduced: 38,
  },
]

const initialTips: Tip[] = [
  {
    id: 1,
    title: "Switch to reusable bags",
    description: "Keep reusable bags handy for grocery shopping to reduce plastic waste.",
    category: "zeroWaste",
    likes: 24,
    author: "ecoUser",
  },
  {
    id: 2,
    title: "Use energy-efficient light bulbs",
    description: "LED bulbs use significantly less energy and last longer than traditional incandescent bulbs.",
    category: "energy",
    likes: 18,
    author: "greenThumb",
  },
  {
    id: 3,
    title: "Fix leaky faucets",
    description:
      "A single dripping faucet can waste up to 20 gallons of water per day. Fixing leaks helps conserve water.",
    category: "water",
    likes: 15,
    author: "waterSaver",
  },
  {
    id: 4,
    title: "Carpool or use public transportation",
    description:
      "Reducing car usage decreases air pollution and carbon emissions. Try carpooling or taking the bus/train.",
    category: "transport",
    likes: 12,
    author: "commuter",
  },
  {
    id: 5,
    title: "Compost food scraps",
    description: "Composting food waste reduces landfill contributions and creates nutrient-rich soil for your garden.",
    category: "zeroWaste",
    likes: 32,
    author: "gardenGuru",
  },
  {
    id: 6,
    title: "Unplug electronics when not in use",
    description: "Even when turned off, many electronics continue to draw power. Unplug them to save energy.",
    category: "energy",
    likes: 9,
    author: "powerSaver",
  },
]

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "Zero Waste Week",
    description:
      "Aim to produce zero waste for an entire week by avoiding single-use plastics and opting for reusable alternatives.",
    category: "zeroWaste",
    duration: "7 days",
    participants: 45,
    completed: 28,
  },
  {
    id: 2,
    title: "Energy Conservation Challenge",
    description:
      "Reduce your energy consumption by turning off lights and unplugging devices when not in use for one week.",
    category: "energy",
    duration: "7 days",
    participants: 32,
    completed: 19,
  },
  {
    id: 3,
    title: "Water Saving Challenge",
    description:
      "Take shorter showers and fix any leaks to save water for two weeks. Monitor your water usage and track your progress.",
    category: "water",
    duration: "14 days",
    participants: 27,
    completed: 12,
  },
  {
    id: 4,
    title: "Sustainable Transportation Challenge",
    description:
      "Use public transportation, bike, or walk for all your trips for one week. Reduce your carbon footprint and stay healthy.",
    category: "transport",
    duration: "7 days",
    participants: 18,
    completed: 9,
  },
  {
    id: 5,
    title: "Plastic-Free Month",
    description:
      "Eliminate all single-use plastics from your life for a month. Find sustainable alternatives for everyday items.",
    category: "zeroWaste",
    duration: "30 days",
    participants: 56,
    completed: 22,
  },
  {
    id: 6,
    title: "Local Food Challenge",
    description:
      "For two weeks, only eat food produced within 100 miles of your home to reduce transportation emissions.",
    category: "transport",
    duration: "14 days",
    participants: 24,
    completed: 11,
  },
]

const initialHabits: Habit[] = [
  { id: 1, name: "Bring reusable bag", category: "zeroWaste", completed: false },
  { id: 2, name: "Turn off lights when leaving room", category: "energy", completed: false },
  { id: 3, name: "Take 5-minute showers", category: "water", completed: false },
  { id: 4, name: "Cycle to work", category: "transport", completed: false },
  { id: 5, name: "Use reusable water bottle", category: "zeroWaste", completed: false },
  { id: 6, name: "Compost food scraps", category: "zeroWaste", completed: false },
]

export default function Home() {
  const [progress, setProgress] = useState(initialProgress)
  const [tips, setTips] = useState(initialTips)
  const [challenges, setChallenges] = useState(initialChallenges)
  const [habits, setHabits] = useState(initialHabits)
  const [selectedTips, setSelectedTips] = useState<number[]>([])
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([])
  const [userInput, setUserInput] = useState<UserInput>({
    newTip: { title: "", description: "", category: "zeroWaste" },
    newChallenge: { title: "", description: "", category: "zeroWaste", duration: "" },
    newHabit: { name: "", category: "zeroWaste" },
    habits: initialHabits,
    selectedTips: [],
    selectedChallenges: [],
  })
  const [showAddTipModal, setShowAddTipModal] = useState(false)
  const [showAddChallengeModal, setShowAddChallengeModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [completedHabits, setCompletedHabits] = useState<number[]>([])
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tips")
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitCategory, setNewHabitCategory] = useState<"zeroWaste" | "energy" | "water" | "transport">("zeroWaste")

  const handleShowAddTipModal = () => {
    setShowAddTipModal(true)
  }

  const handleCloseAddTipModal = () => {
    setShowAddTipModal(false)
  }

  const handleShowAddChallengeModal = () => {
    setShowAddChallengeModal(true)
  }

  const handleCloseAddChallengeModal = () => {
    setShowAddChallengeModal(false)
  }

  const handleAddTip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validatedCategory = userInput.newTip.category || "zeroWaste"

    const newTip: Tip = {
      id: tips.length + 1,
      title: userInput.newTip.title,
      description: userInput.newTip.description,
      category: validatedCategory,
      likes: 0,
      author: "You",
    }

    setTips([...tips, newTip])

    setUserInput({
      ...userInput,
      newTip: { title: "", description: "", category: validatedCategory },
    })

    setShowAddTipModal(false)
  }

  const handleAddChallenge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validatedCategory = userInput.newChallenge.category || "zeroWaste"

    const newChallenge: Challenge = {
      id: challenges.length + 1,
      title: userInput.newChallenge.title,
      description: userInput.newChallenge.description,
      category: validatedCategory,
      duration: userInput.newChallenge.duration || "7 days",
      participants: 0,
      completed: 0,
    }

    setChallenges([...challenges, newChallenge])

    setUserInput({
      ...userInput,
      newChallenge: { title: "", description: "", category: validatedCategory, duration: "" },
    })

    setShowAddChallengeModal(false)
  }

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newHabitName.trim()) return

    const newHabit: Habit = {
      id: habits.length + 1,
      name: newHabitName,
      category: newHabitCategory,
      completed: false,
    }

    setHabits([...habits, newHabit])
    setNewHabitName("")
    setNewHabitCategory("zeroWaste")
  }

  const handleLikeTip = (tipId: number) => {
    const updatedTips = tips.map((tip) => {
      if (tip.id === tipId) {
        return { ...tip, likes: tip.likes + 1 }
      }
      return tip
    })

    const sortedTips = [...updatedTips].sort((a, b) => b.likes - a.likes)
    setTips(sortedTips)
  }

  const handleJoinChallenge = (challengeId: number) => {
    setSelectedChallenges([...selectedChallenges, challengeId])
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === challengeId) {
        return { ...challenge, participants: challenge.participants + 1 }
      }
      return challenge
    })
    setChallenges(updatedChallenges)
  }

  const handleCompleteChallenge = (challengeId: number) => {
    setSelectedChallenges(selectedChallenges.filter((id) => id !== challengeId))
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === challengeId) {
        return { ...challenge, completed: challenge.completed + 1 }
      }
      return challenge
    })
    setChallenges(updatedChallenges)
  }

  const handleTrackProgress = () => {
    const newProgress: Progress = {
      date: new Date().toISOString().split("T")[0],
      tipsCompleted: selectedTips.length,
      challengesCompleted: selectedChallenges.length,
      carbonSaved: selectedTips.length * 10 + selectedChallenges.length * 20,
      waterSaved: selectedTips.length * 5 + selectedChallenges.length * 10,
      wasteReduced: selectedTips.length * 2 + selectedChallenges.length * 5,
    }
    setProgress([...progress, newProgress])
  }

  const handleSetHabits = (habitId: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        return { ...habit, completed: !habit.completed }
      }
      return habit
    })
    setHabits(updatedHabits)
    setUserInput({ ...userInput, habits: updatedHabits })
  }

  const handleSetCompletedHabits = (habitId: number) => {
    setCompletedHabits((prev) => (prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId]))
  }

  const handleResetHabits = () => {
    const resetHabits = habits.map((habit) => ({ ...habit, completed: false }))
    setHabits(resetHabits)
    setUserInput({ ...userInput, habits: resetHabits })
    setCompletedHabits([])
  }

  const handleDeleteHabit = (habitId: number) => {
    setHabits(habits.filter((habit) => habit.id !== habitId))
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  useEffect(() => {
    // Check for user's preferred color scheme
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const hasSeenWelcomeModal = localStorage.getItem("hasSeenWelcomeModal")

    if (!hasSeenWelcomeModal) {
      setShowWelcomeModal(true)
      localStorage.setItem("hasSeenWelcomeModal", "true")
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddTipModal(false)
        setShowAddChallengeModal(false)
        setShowHabitModal(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const carbonSaved = progress.reduce((acc, curr) => acc + curr.carbonSaved, 0)
  const waterSaved = progress.reduce((acc, curr) => acc + curr.waterSaved, 0)
  const wasteReduced = progress.reduce((acc, curr) => acc + curr.wasteReduced, 0)

  const totalCarbonSaved = carbonSaved + selectedTips.length * 10 + selectedChallenges.length * 20
  const totalWaterSaved = waterSaved + selectedTips.length * 5 + selectedChallenges.length * 10
  const totalWasteReduced = wasteReduced + selectedTips.length * 2 + selectedChallenges.length * 5

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-green-500">
          <p className="font-bold text-gray-900 dark:text-white">{label}</p>
          <p className="text-green-700 dark:text-green-300">
            Carbon Saved: <span className="font-bold">{payload[0].payload.carbonSaved} kg</span>
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            Water Saved: <span className="font-bold">{payload[0].payload.waterSaved} L</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Waste Reduced: <span className="font-bold">{payload[0].payload.wasteReduced} kg</span>
          </p>
        </div>
      )
    }
    return null
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "zeroWaste":
        return <Leaf className="h-4 w-4" aria-hidden="true" />
      case "energy":
        return <Wind className="h-4 w-4" aria-hidden="true" />
      case "water":
        return <Droplet className="h-4 w-4" aria-hidden="true" />
      case "transport":
        return <Calendar className="h-4 w-4" aria-hidden="true" />
      default:
        return <Leaf className="h-4 w-4" aria-hidden="true" />
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-green-600 dark:bg-green-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Leaf className="h-8 w-8 text-white mr-2" />
                <span className="text-white font-bold text-xl">EcoLife</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#home"
                    className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Home
                  </a>
                  <a
                    href="#tips"
                    className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Eco Tips
                  </a>
                  <a
                    href="#challenges"
                    className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Challenges
                  </a>
                  <a
                    href="#habits"
                    className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Habits
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-green-700 dark:bg-green-800 hover:bg-green-600 dark:hover:bg-green-700 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-150 mr-2"
                onClick={toggleDarkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <div className="md:hidden">
                <button
                  type="button"
                  className="bg-green-700 dark:bg-green-800 hover:bg-green-600 dark:hover:bg-green-700 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-150"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-500 dark:bg-green-700 rounded-b-lg">
                <a
                  href="#home"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 dark:hover:bg-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#tips"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 dark:hover:bg-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Eco Tips
                </a>
                <a
                  href="#challenges"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 dark:hover:bg-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Challenges
                </a>
                <a
                  href="#habits"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 dark:hover:bg-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Habits
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence>
          {showWelcomeModal && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Welcome to EcoLife!</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Thank you for joining our eco-friendly community. This platform is designed to help you track your
                  sustainable habits, complete eco-challenges, and share tips with like-minded individuals.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowWelcomeModal(false)}
                    className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mb-12" id="home">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
              Live Sustainably with EcoLife
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track your eco-friendly habits, join challenges, and share tips to make a positive impact on our planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">Your Eco Journey</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Carbon Saved</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalCarbonSaved} kg</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Water Saved</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalWaterSaved} L</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Waste Reduced</h3>
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{totalWasteReduced} kg</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                    <Wind className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHabitModal(true)}
                className="mt-8 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-150 w-full flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Track Your Habits
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg h-full"
            >
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">Progress Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="carbonSaved"
                      stroke="#10b981"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ stroke: "#10b981", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="waterSaved"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="wasteReduced"
                      stroke="#6b7280"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ stroke: "#6b7280", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mb-12" id="tips">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Eco Tips</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowAddTipModal}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Tip
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${
                  tip.category === "zeroWaste"
                    ? "border-green-500 dark:border-green-600"
                    : tip.category === "energy"
                      ? "border-blue-500 dark:border-blue-600"
                      : tip.category === "water"
                        ? "border-teal-500 dark:border-teal-600"
                        : "border-purple-500 dark:border-purple-600"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tip.title}</h3>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                        tip.category === "zeroWaste"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : tip.category === "energy"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : tip.category === "water"
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300"
                              : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      {getCategoryIcon(tip.category)}
                      <span className="ml-1">{tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}</span>
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{tip.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">By {tip.author}</span>
                  <button
                    onClick={() => handleLikeTip(tip.id)}
                    className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.4-.608 2.011L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    {tip.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12" id="challenges">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Eco Challenges</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowAddChallengeModal}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Challenge
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${
                  challenge.category === "zeroWaste"
                    ? "border-green-500 dark:border-green-600"
                    : challenge.category === "energy"
                      ? "border-blue-500 dark:border-blue-600"
                      : challenge.category === "water"
                        ? "border-teal-500 dark:border-teal-600"
                        : "border-purple-500 dark:border-purple-600"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                        challenge.category === "zeroWaste"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : challenge.category === "energy"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : challenge.category === "water"
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300"
                              : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      {getCategoryIcon(challenge.category)}
                      <span className="ml-1">
                        {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{challenge.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Duration: {challenge.duration}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-600 dark:bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(challenge.completed / (challenge.participants || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {Array(Math.min(3, challenge.participants))
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200 border-2 border-white dark:border-gray-800"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      {challenge.participants > 3 && (
                        <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200 border-2 border-white dark:border-gray-800">
                          +{challenge.participants - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{challenge.participants} joined</span>
                  </div>
                  {selectedChallenges.includes(challenge.id) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 text-sm flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 text-sm"
                    >
                      Join
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12" id="habits">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Track Your Habits</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHabitModal(true)}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Manage Habits
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${
                  habit.completed ? "border-green-500 dark:border-green-600" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{habit.name}</h3>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                        habit.completed
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {habit.completed ? <Check className="h-3 w-3 mr-1" /> : null}
                      {habit.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-sm font-semibold flex items-center ${
                      habit.completed ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {getCategoryIcon(habit.category)}
                    <span className="ml-1">{habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}</span>
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => handleSetHabits(habit.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">Community Feed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Eco Achievements</h3>
              <div className="space-y-4">
                {progress.slice(-3).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Carbon Saved: {item.carbonSaved} kg, Water Saved: {item.waterSaved} L, Waste Reduced:{" "}
                        {item.wasteReduced} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Eco Tips</h3>
              <div className="space-y-4">
                {[...tips]
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 3)
                  .map((tip) => (
                    <div key={tip.id} className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{tip.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tip.likes} likes</p>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence>
          {showAddTipModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddTipModal(false)
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Add New Eco Tip</h2>
                  <button
                    onClick={handleCloseAddTipModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleAddTip} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={userInput.newTip.title}
                      onChange={(e) =>
                        setUserInput({ ...userInput, newTip: { ...userInput.newTip, title: e.target.value } })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={userInput.newTip.description}
                      onChange={(e) =>
                        setUserInput({ ...userInput, newTip: { ...userInput.newTip, description: e.target.value } })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={userInput.newTip.category}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newTip: {
                            ...userInput.newTip,
                            category: e.target.value as "zeroWaste" | "energy" | "water" | "transport",
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                    >
                      <option value="zeroWaste">Zero Waste</option>
                      <option value="energy">Energy</option>
                      <option value="water">Water</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCloseAddTipModal}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-150"
                    >
                      Add Tip
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddChallengeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddChallengeModal(false)
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Add New Eco Challenge</h2>
                  <button
                    onClick={handleCloseAddChallengeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleAddChallenge} className="space-y-4">
                  <div>
                    <label
                      htmlFor="challengeTitle"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="challengeTitle"
                      value={userInput.newChallenge.title}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newChallenge: { ...userInput.newChallenge, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="challengeDescription"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="challengeDescription"
                      value={userInput.newChallenge.description}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newChallenge: { ...userInput.newChallenge, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="challengeCategory"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="challengeCategory"
                      value={userInput.newChallenge.category}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newChallenge: {
                            ...userInput.newChallenge,
                            category: e.target.value as "zeroWaste" | "energy" | "water" | "transport",
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                    >
                      <option value="zeroWaste">Zero Waste</option>
                      <option value="energy">Energy</option>
                      <option value="water">Water</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="challengeDuration"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      id="challengeDuration"
                      value={userInput.newChallenge.duration}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newChallenge: { ...userInput.newChallenge, duration: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCloseAddChallengeModal}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-150"
                    >
                      Add Challenge
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHabitModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowHabitModal(false)
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Track Your Habits</h2>
                  <button
                    onClick={() => setShowHabitModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddHabit} className="mb-4">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Enter habit name"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors duration-150"
                    />
                    <div className="flex items-center w-full">
                      <select
                        value={newHabitCategory}
                        onChange={(e) =>
                          setNewHabitCategory(e.target.value as "zeroWaste" | "energy" | "water" | "transport")
                        }
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      >
                        <option value="zeroWaste">Zero Waste</option>
                        <option value="energy">Energy</option>
                        <option value="water">Water</option>
                        <option value="transport">Transport</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-r-lg transition-colors duration-150"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </form>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            habit.completed ? "bg-green-200 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-800"
                          } flex items-center justify-center mr-3`}
                        >
                          {habit.completed ? (
                            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            habit.completed ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`mr-2 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                            habit.completed
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {habit.completed ? "Done" : "Pending"}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => handleSetHabits(habit.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetHabits}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-150"
                  >
                    Reset All Habits
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHabitModal(false)}
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-150"
                  >
                    Done
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-green-600 dark:bg-green-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Leaf className="h-6 w-6 mr-2" />
                EcoLife
              </h2>
              <p className="text-green-100 dark:text-green-300 text-sm mt-2 max-w-md">
                Join our community in making a difference. Track your habits, complete eco-challenges, and share tips to
                live a more sustainable life.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-green-100 hover:text-white transition-colors duration-150">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#tips" className="text-green-100 hover:text-white transition-colors duration-150">
                    Eco Tips
                  </a>
                </li>
                <li>
                  <a href="#challenges" className="text-green-100 hover:text-white transition-colors duration-150">
                    Challenges
                  </a>
                </li>
                <li>
                  <a href="#habits" className="text-green-100 hover:text-white transition-colors duration-150">
                    Habits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-150">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-150">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-150">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-green-100 dark:text-green-300 mt-4">
                © {new Date().getFullYear()} EcoLife. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Zod Schema
export const Schema = {
  commentary:
    "This is a simple app that helps people live more eco-friendly lives. It has a section for users to share green tips and guides, and another for eco challenges to motivate users to adopt sustainable habits. Users can track their environmental impact and share their progress with the community.",
  template: "nextjs-developer",
  title: "Eco Life",
  description: "A simple app to help people live more eco-friendly lives.",
  additional_dependencies: ["framer-motion", "recharts", "lucide-react"],
  has_additional_dependencies: true,
  install_dependencies_command: "npm install framer-motion recharts lucide-react",
  port: 3000,
  file_path: "pages/index.tsx",
  code: "<see code above>",
}
