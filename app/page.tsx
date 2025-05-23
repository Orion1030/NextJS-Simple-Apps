"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"

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

interface UserInput {
  newTip: NewTip
  newChallenge: NewChallenge
  habits: Habit[]
  selectedTips: number[]
  selectedChallenges: number[]
}

const initialProgress: Progress[] = [
  { date: "2024-09-01", tipsCompleted: 2, challengesCompleted: 1, carbonSaved: 120, waterSaved: 50, wasteReduced: 8 },
  { date: "2024-09-02", tipsCompleted: 5, challengesCompleted: 2, carbonSaved: 250, waterSaved: 80, wasteReduced: 15 },
  { date: "2024-09-03", tipsCompleted: 7, challengesCompleted: 3, carbonSaved: 320, waterSaved: 120, wasteReduced: 22 },
  { date: "2024-09-04", tipsCompleted: 10, challengesCompleted: 5, carbonSaved: 450, waterSaved: 180, wasteReduced: 30 },
  { date: "2024-09-05", tipsCompleted: 12, challengesCompleted: 6, carbonSaved: 520, waterSaved: 220, wasteReduced: 38 },
]

const initialTips: Tip[] = [
  { id: 1, title: "Switch to reusable bags", description: "Keep reusable bags handy for grocery shopping to reduce plastic waste.", category: "zeroWaste", likes: 0, author: "ecoUser" },
  { id: 2, title: "Use energy-efficient light bulbs", description: "LED bulbs use significantly less energy and last longer than traditional incandescent bulbs.", category: "energy", likes: 0, author: "ecoUser" },
  { id: 3, title: "Fix leaky faucets", description: "A single dripping faucet can waste up to 20 gallons of water per day. Fixing leaks helps conserve water.", category: "water", likes: 0, author: "ecoUser" },
  { id: 4, title: "Carpool or use public transportation", description: "Reducing car usage decreases air pollution and carbon emissions. Try carpooling or taking the bus/train.", category: "transport", likes: 0, author: "ecoUser" },
]

const initialChallenges: Challenge[] = [
  { id: 1, title: "Zero Waste Week", description: "Aim to produce zero waste for an entire week by avoiding single-use plastics and opting for reusable alternatives.", category: "zeroWaste", duration: "7 days", participants: 0, completed: 0 },
  { id: 2, title: "Energy Conservation Challenge", description: "Reduce your energy consumption by turning off lights and unplugging devices when not in use for one week.", category: "energy", duration: "7 days", participants: 0, completed: 0 },
  { id: 3, title: "Water Saving Challenge", description: "Take shorter showers and fix any leaks to save water for two weeks. Monitor your water usage and track your progress.", category: "water", duration: "14 days", participants: 0, completed: 0 },
  { id: 4, title: "Sustainable Transportation Challenge", description: "Use public transportation, bike, or walk for all your trips for one week. Reduce your carbon footprint and stay healthy.", category: "transport", duration: "7 days", participants: 0, completed: 0 },
]

const initialHabits: Habit[] = [
  { id: 1, name: "Bring reusable bag", category: "zeroWaste", completed: false },
  { id: 2, name: "Turn off lights when leaving room", category: "energy", completed: false },
  { id: 3, name: "Take 5-minute showers", category: "water", completed: false },
  { id: 4, name: "Cycle to work", category: "transport", completed: false },
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
    habits: initialHabits,
    selectedTips: [],
    selectedChallenges: [],
  })
  const [showAddTipModal, setShowAddTipModal] = useState(false)
  const [showAddChallengeModal, setShowAddChallengeModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [completedHabits, setCompletedHabits] = useState<number[]>([])
  const [showHabitModal, setShowHabitModal] = useState(false)

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
    setCompletedHabits((prev) =>
      prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId],
    )
  }

  const handleResetHabits = () => {
    const resetHabits = habits.map((habit) => ({ ...habit, completed: false }))
    setHabits(resetHabits)
    setUserInput({ ...userInput, habits: resetHabits })
    setCompletedHabits([])
  }

  const handleShowAddTipModal = () => {
    setShowAddTipModal(true)
  }

  const handleShowAddChallengeModal = () => {
    setShowAddChallengeModal(true)
  }

  const handleCloseAddTipModal = () => {
    setShowAddTipModal(false)
  }

  const handleCloseAddChallengeModal = () => {
    setShowAddChallengeModal(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    setMounted(true)

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${mounted ? "bg-gray-50 dark:bg-gray-900" : ""}`}>
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-50 w-full bg-green-600 dark:bg-green-800 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
                        href="#about"
                        className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                      >
                        About
                      </a>
                      <a
                        href="#features"
                        className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                      >
                        Features
                      </a>
                      <a
                        href="#contact"
                        className="text-white hover:bg-green-700 dark:hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="bg-green-700 dark:bg-green-800 hover:bg-green-600 dark:hover:bg-green-700 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-150"
                      onClick={() => {
                        const newTheme = mounted ? (document.documentElement.classList.contains("dark") ? "" : "dark") : ""
                        document.documentElement.classList.toggle("dark", newTheme === "dark")
                      }}
                    >
                      <span className="sr-only">Toggle dark mode</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Water Saved</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalWaterSaved} L</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Waste Reduced</h3>
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{totalWasteReduced} kg</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHabitModal(true)}
                className="mt-8 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 w-full"
              >
                Track Your Habits
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
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

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Eco Tips</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowAddTipModal}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tip.category === "zeroWaste"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : tip.category === "energy"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : tip.category === "water"
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300"
                              : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
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

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Eco Challenges</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowAddChallengeModal}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        challenge.category === "zeroWaste"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : challenge.category === "energy"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : challenge.category === "water"
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300"
                              : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{challenge.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Duration: {challenge.duration}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {Array(Math.min(5, challenge.participants))
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200">
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{challenge.participants} participants</span>
                  </div>
                  {selectedChallenges.includes(challenge.id) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 text-sm"
                    >
                      Complete
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 text-sm"
                    >
                      Join
                    </motion.button>
                  )}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
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

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Track Your Habits</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHabitModal(true)}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Habit
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        habit.completed
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {habit.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-sm font-semibold ${
                      habit.completed ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
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
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">Eco Challenges Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      challenge.completed > 0
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {challenge.completed > 0 ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-600 dark:bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(challenge.completed / (challenge.participants || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.completed} completed</span>
                </div>
              </motion.div>
            ))}
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
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Add New Eco Tip</h2>
                <form onSubmit={handleAddTip} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={userInput.newTip.title}
                      onChange={(e) => setUserInput({ ...userInput, newTip: { ...userInput.newTip, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={userInput.newTip.category}
                      onChange={(e) => setUserInput({ ...userInput, newTip: { ...userInput.newTip, category: e.target.value } })}
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
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Add New Eco Challenge</h2>
                <form onSubmit={handleAddChallenge} className="space-y-4">
                  <div>
                    <label htmlFor="challengeTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="challengeTitle"
                      value={userInput.newChallenge.title}
                      onChange={(e) =>
                        setUserInput({ ...userInput, newChallenge: { ...userInput.newChallenge, title: e.target.value } })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="challengeDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <label htmlFor="challengeCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      id="challengeCategory"
                      value={userInput.newChallenge.category}
                      onChange={(e) =>
                        setUserInput({
                          ...userInput,
                          newChallenge: { ...userInput.newChallenge, category: e.target.value },
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
                    <label htmlFor="challengeDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      id="challengeDuration"
                      value={userInput.newChallenge.duration}
                      onChange={(e) =>
                        setUserInput({ ...userInput, newChallenge: { ...userInput.newChallenge, duration: e.target.value } })
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
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Track Your Habits</h2>
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    placeholder="New habit name"
                    value={""}
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                  />
                  <select
                    value={""}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-150"
                  >
                    <option value="zeroWaste">Zero Waste</option>
                    <option value="energy">Energy</option>
                    <option value="water">Water</option>
                    <option value="transport">Transport</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-r-lg transition-colors duration-150"
                  >
                    Add
                  </motion.button>
                </div>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-600 dark:text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
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
                            onChange={() => handleSetCompletedHabits(habit.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
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
                    Reset Habits
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

      <footer className="bg-green-600 dark:bg-green-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">EcoLife</h2>
              <p className="text-green-100 dark:text-green-300 text-sm mt-2 max-w-md">
                Join our community in making a difference. Track your habits, complete eco-challenges, and share tips to
                live a more sustainable life.
              </p>
            </div>
            <div>
              <p className="text-sm text-green-100 dark:text-green-300">© {new Date().getFullYear()} EcoLife. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Zod Schema
export const Schema = {
    "commentary": "This is a simple app that helps people live more eco-friendly lives. It has a section for users to share green tips and guides, and another for eco challenges to motivate users to adopt sustainable habits. Users can track their environmental impact and share their progress with the community.",
    "template": "nextjs-developer",
    "title": "Eco Life",
    "description": "A simple app to help people live more eco-friendly lives.",
    "additional_dependencies": [
        "framer-motion",
        "recharts",
        "lucide-react"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install framer-motion recharts lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}