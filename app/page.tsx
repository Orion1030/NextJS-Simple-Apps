"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Leaf, Trophy, Users, Plus } from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

interface Tip {
  id: number;
  text: string;
  likes: number;
  likedByUser: boolean;
  category: string;
  author: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  participants: number;
  completedByUser: boolean;
}

interface UserStats {
  points: number;
  challengesCompleted: number;
  tipsShared: number;
  carbonSaved: number;
}

interface ChartDataPoint {
  name: string;
  carbon: number;
}

const EcoFriendlyApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("tips");
  const [newTip, setNewTip] = useState("");
  const [tipCategory, setTipCategory] = useState("general");
  const [showAddTipForm, setShowAddTipForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [tips, setTips] = useState<Tip[]>([
    {
      id: 1,
      text: "Use reusable water bottles instead of plastic ones",
      likes: 24,
      likedByUser: false,
      category: "daily-habits",
      author: "EcoWarrior",
    },
    {
      id: 2,
      text: "Switch to energy-efficient LED light bulbs",
      likes: 18,
      likedByUser: false,
      category: "energy-saving",
      author: "GreenTeam",
    },
    {
      id: 3,
      text: "Plant more trees in your community",
      likes: 42,
      likedByUser: false,
      category: "nature",
      author: "TreeHugger",
    },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Plastic Free Week",
      description: "Avoid all single-use plastics for 7 days",
      points: 50,
      participants: 124,
      completedByUser: false,
    },
    {
      id: 2,
      title: "30-Day Walking Challenge",
      description: "Walk 30 minutes every day for a month",
      points: 100,
      participants: 89,
      completedByUser: false,
    },
    {
      id: 3,
      title: "Community Clean-Up",
      description: "Join a local park or beach clean-up event",
      points: 75,
      participants: 42,
      completedByUser: false,
    },
  ]);

  const [userStats, setUserStats] = useState<UserStats>({
    points: 250,
    challengesCompleted: 5,
    tipsShared: 8,
    carbonSaved: 120,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    { name: "Jan", carbon: 100 },
    { name: "Feb", carbon: 120 },
    { name: "Mar", carbon: 95 },
    { name: "Apr", carbon: 110 },
    { name: "May", carbon: 85 },
    { name: "Jun", carbon: 75 },
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const likeTip = (tipId: number) => {
    setTips(
      tips.map((tip) =>
        tip.id === tipId
          ? {
              ...tip,
              likes: tip.likedByUser ? tip.likes - 1 : tip.likes + 1,
              likedByUser: !tip.likedByUser,
            }
          : tip
      )
    );
  };

  const joinChallenge = (challengeId: number) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === challengeId
          ? {
              ...challenge,
              participants: challenge.completedByUser
                ? challenge.participants - 1
                : challenge.participants + 1,
              completedByUser: !challenge.completedByUser,
            }
          : challenge
      )
    );

    const completedChallenge = challenges.find(
      (c) => c.id === challengeId && !c.completedByUser
    );

    if (completedChallenge) {
      const newPoints = userStats.points + completedChallenge.points;
      setUserStats({
        ...userStats,
        points: newPoints,
        challengesCompleted: userStats.challengesCompleted + 1,
      });

      setCelebrationMessage(`+${completedChallenge.points} points`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      if (newPoints >= 500 && newPoints - completedChallenge.points < 500) {
        setCelebrationMessage("500 Points Unlocked - Eco Hero Level!");
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  };

  const submitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTip.trim()) {
      const newTipObj: Tip = {
        id: tips.length + 1,
        text: newTip,
        likes: 0,
        likedByUser: false,
        category: tipCategory,
        author: "You",
      };
      setTips([newTipObj, ...tips]);
      setNewTip("");
      setTipCategory("general");
      setShowAddTipForm(false);

      setUserStats({
        ...userStats,
        tipsShared: userStats.tipsShared + 1,
      });

      setCelebrationMessage("Tip Shared Successfully!");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const filterTips = (category: string) => {
    if (category === "all") return tips;

    return tips.filter((tip) => tip.category === category);
  };

  const getLevel = () => {
    if (userStats.points < 100) return "Eco Newbie";
    if (userStats.points < 300) return "Green Advocate";
    if (userStats.points < 500) return "Eco Warrior";
    return "Eco Hero";
  };

  const getLevelProgress = () => {
    const points = userStats.points;
    if (points < 100) return (points / 100) * 100;
    if (points < 300) return ((points - 100) / 200) * 100;
    if (points < 500) return ((points - 300) / 200) * 100;
    return 100;
  };

  const nextLevel = () => {
    const points = userStats.points;
    if (points < 100) return 100 - points;
    if (points < 300) return 300 - points;
    if (points < 500) return 500 - points;
    return 0;
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-green-50"
        }`}
      ></div>
    );
  }

  return (
    <motion.div
      key={darkMode ? "dark" : "light"}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-green-50"
      } font-outfit transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-between items-center mb-10"
        >
          <div className="flex items-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            >
              <Leaf
                size={36}
                className={`${darkMode ? "text-green-400" : "text-green-600"}`}
              />
            </motion.div>
            <h1
              className={`text-3xl md:text-4xl font-bold ml-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              EcoConnect
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-blue-100 text-blue-800"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                : "bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800"
            }`}
          >
            <div className="flex items-center mb-2">
              <Trophy className="text-yellow-500 mr-2" size={20} />
              <h3 className="font-semibold">Points</h3>
            </div>
            <p className="text-2xl font-bold">{userStats.points}</p>
            <p className="text-sm opacity-80">{getLevel()}</p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  darkMode ? "bg-green-500" : "bg-green-600"
                }`}
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1">
              {nextLevel() > 0
                ? `${nextLevel()} points to next level`
                : "Max level achieved"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                : "bg-gradient-to-br from-green-100 to-green-200 text-gray-800"
            }`}
          >
            <div className="flex items-center mb-2">
              <Users className="text-green-500 mr-2" size={20} />
              <h3 className="font-semibold">Challenges</h3>
            </div>
            <p className="text-2xl font-bold">
              {userStats.challengesCompleted}
            </p>
            <p className="text-sm opacity-80">Completed</p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  darkMode ? "bg-blue-500" : "bg-blue-600"
                }`}
                style={{
                  width: `${
                    (userStats.challengesCompleted /
                      (userStats.challengesCompleted + 5)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs mt-1">
              {userStats.challengesCompleted + 5} challenges in progress
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                : "bg-gradient-to-br from-purple-100 to-purple-200 text-gray-800"
            }`}
          >
            <div className="flex items-center mb-2">
              <Leaf className="text-purple-500 mr-2" size={20} />
              <h3 className="font-semibold">Carbon Saved</h3>
            </div>
            <p className="text-2xl font-bold">{userStats.carbonSaved} kg</p>
            <p className="text-sm opacity-80">CO₂ reduced</p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  darkMode ? "bg-purple-500" : "bg-purple-600"
                }`}
                style={{ width: `${(userStats.carbonSaved / 200) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1">Goal: 200 kg CO₂ saved</p>
          </motion.div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Leaf
              className={`${
                darkMode ? "text-green-400" : "text-green-600"
              } mr-2`}
              size={24}
            />
            Carbon Savings Trend
          </h2>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                : "bg-white"
            }`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#555" : "#eee"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#eee" : "#666"}
                  tick={{ fill: darkMode ? "#eee" : "#666" }}
                />
                <YAxis
                  stroke={darkMode ? "#eee" : "#666"}
                  tick={{ fill: darkMode ? "#eee" : "#666" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#333" : "#fff",
                    border: "none",
                    color: darkMode ? "#fff" : "#000",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="carbon"
                  stroke={darkMode ? "#3b82f6" : "#2563eb"}
                  fill={darkMode ? "#60a5fa" : "#93c5fd"}
                  fillOpacity={0.6}
                  animationBegin={100}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`mb-8 flex border-b ${
            darkMode
              ? "border-gray-700 text-gray-300"
              : "border-gray-200 text-gray-600"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("tips")}
            className={`py-4 px-6 flex items-center ${
              activeTab === "tips"
                ? darkMode
                  ? "border-b-2 border-green-400 font-bold text-green-400"
                  : "border-b-2 border-green-600 font-bold text-green-600"
                : ""
            }`}
          >
            <Leaf className="mr-2" size={18} />
            Eco Tips
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("challenges")}
            className={`py-4 px-6 flex items-center ${
              activeTab === "challenges"
                ? darkMode
                  ? "border-b-2 border-green-400 font-bold text-green-400"
                  : "border-b-2 border-green-600 font-bold text-green-600"
                : ""
            }`}
          >
            <Trophy className="mr-2" size={18} />
            Challenges
          </motion.button>
        </motion.nav>

        <AnimatePresence mode="wait">
          {activeTab === "tips" && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Community Eco Tips</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTipForm(!showAddTipForm)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  <Plus size={16} />
                  <span>Add Tip</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {showAddTipForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={submitTip}
                    className={`mb-8 p-6 rounded-xl shadow-md ${
                      darkMode
                        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">Share Your Tip</h3>
                    <div className="mb-4">
                      <textarea
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        placeholder="What's your eco-friendly tip?"
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-600 border-gray-700 text-white focus:ring-2 focus:ring-green-400"
                            : "border-gray-300 focus:ring-2 focus:ring-green-500"
                        }`}
                        rows={4}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 font-semibold">
                        Category
                      </label>
                      <select
                        value={tipCategory}
                        onChange={(e) => setTipCategory(e.target.value)}
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-600 border-gray-700 text-white focus:ring-2 focus:ring-green-400"
                            : "border-gray-300 focus:ring-2 focus:ring-green-500"
                        }`}
                      >
                        <option value="general">General</option>
                        <option value="energy-saving">Energy Saving</option>
                        <option value="daily-habits">Daily Habits</option>
                        <option value="nature">Nature & Waste</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={!newTip.trim()}
                        className={`px-4 py-2 rounded-lg ${
                          newTip.trim()
                            ? darkMode
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      >
                        Share Tip
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => setShowAddTipForm(false)}
                        className={`px-4 py-2 rounded-lg ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="flex mb-6 overflow-x-auto gap-2">
                {["all", "energy-saving", "daily-habits", "nature"].map(
                  (category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(category)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                        activeTab === category
                          ? darkMode
                            ? "bg-green-600 text-white"
                            : "bg-green-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </motion.button>
                  )
                )}
              </div>

              <div className="space-y-4">
                {filterTips(activeTab).map((tip) => (
                  <motion.div
                    key={tip.id}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl shadow-md ${
                      darkMode
                        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p
                          className={`text-lg ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {tip.text}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Shared by {tip.author}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => likeTip(tip.id)}
                          className={`flex items-center gap-1 ${
                            tip.likedByUser
                              ? "text-red-500"
                              : darkMode
                              ? "text-gray-400 hover:text-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={tip.likedByUser ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
                          </svg>
                          <span>{tip.likes}</span>
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full mr-2 ${
                          darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tip.category
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "challenges" && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Eco Challenges</h2>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl shadow-md ${
                      darkMode
                        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {challenge.title}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {challenge.description}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          darkMode
                            ? "bg-gray-800 text-green-400"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {challenge.points} pts
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Users
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                          size={16}
                        />
                        <span className="ml-1 text-sm">
                          {challenge.participants} participants
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => joinChallenge(challenge.id)}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          challenge.completedByUser
                            ? darkMode
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-200 text-gray-600"
                            : darkMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        disabled={challenge.completedByUser}
                      >
                        {challenge.completedByUser ? "Completed" : "Join"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
            >
              <Trophy size={20} />
              <span className="font-semibold">{celebrationMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EcoFriendlyApp;
// Zod Schema
export const Schema = {
  commentary:
    "This code generates a simple web app where users can share eco-friendly tips and participate in environmental challenges. The app is built with Next.js and TypeScript, and it supports light and dark modes for comfortable viewing.",
  template: "nextjs-developer",
  title: "Eco App",
  description:
    "A simple web app for sharing eco-friendly tips and participating in environmental challenges.",
  additional_dependencies: ["motion"],
  has_additional_dependencies: true,
  install_dependencies_command: "npm install motion",
  port: 3000,
  file_path: "pages/index.tsx",
  code: "<see code above>",
};
