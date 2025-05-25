"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Leaf,
  Trophy,
  Users,
  Plus,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Search,
  TrendingUp,
  Award,
  Target,
  MapPin,
  Globe,
  Mail,
  Github,
  Twitter,
  Instagram,
  ChevronUp,
  Star,
  Zap,
  Lightbulb,
  Bell,
  User,
  BarChart3,
  Activity,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
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
  bookmarked: boolean;
  category: string;
  author: string;
  avatar: string;
  timestamp: string;
  comments: number;
  shares: number;
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  tags: string[];
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  participants: number;
  completedByUser: boolean;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  category: string;
  deadline: string;
  progress: number;
  requirements: string[];
}

interface UserStats {
  points: number;
  challengesCompleted: number;
  tipsShared: number;
  carbonSaved: number;
  streak: number;
  rank: number;
  badges: string[];
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const EcoFriendlyApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [newTip, setNewTip] = useState("");
  const [tipCategory, setTipCategory] = useState("general");
  const [tipDifficulty, setTipDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [tipImpact, setTipImpact] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [showAddTipForm, setShowAddTipForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const [tips, setTips] = useState<Tip[]>([
    {
      id: 1,
      text: "Switch to LED bulbs to reduce energy consumption by up to 80%. They last 25 times longer than traditional incandescent bulbs and significantly lower your electricity bill.",
      likes: 156,
      likedByUser: false,
      bookmarked: false,
      category: "energy-saving",
      author: "EcoWarrior",
      avatar: "🌱",
      timestamp: "2 hours ago",
      comments: 23,
      shares: 12,
      difficulty: "easy",
      impact: "high",
      tags: ["electricity", "home", "savings"],
    },
    {
      id: 2,
      text: "Start composting kitchen scraps to reduce waste and create nutrient-rich soil for your garden. It's easier than you think and makes a huge environmental impact!",
      likes: 89,
      likedByUser: true,
      bookmarked: true,
      category: "waste-reduction",
      author: "GreenThumb",
      avatar: "🌿",
      timestamp: "5 hours ago",
      comments: 31,
      shares: 18,
      difficulty: "medium",
      impact: "high",
      tags: ["composting", "garden", "waste"],
    },
    {
      id: 3,
      text: "Use a reusable water bottle and save over 1,500 plastic bottles per year. Choose stainless steel or glass for the best environmental and health benefits.",
      likes: 234,
      likedByUser: false,
      bookmarked: false,
      category: "daily-habits",
      author: "HydroHero",
      avatar: "💧",
      timestamp: "1 day ago",
      comments: 45,
      shares: 67,
      difficulty: "easy",
      impact: "medium",
      tags: ["plastic", "hydration", "daily"],
    },
    {
      id: 4,
      text: "Plant native species in your garden to support local wildlife and reduce water usage. Native plants are adapted to your climate and require less maintenance.",
      likes: 178,
      likedByUser: false,
      bookmarked: true,
      category: "nature",
      author: "WildlifeGuardian",
      avatar: "🦋",
      timestamp: "2 days ago",
      comments: 28,
      shares: 34,
      difficulty: "medium",
      impact: "high",
      tags: ["gardening", "wildlife", "native"],
    },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Zero Waste Week",
      description:
        "Eliminate all single-use items for 7 consecutive days. Track your progress and share tips with the community.",
      points: 100,
      participants: 1247,
      completedByUser: false,
      difficulty: "hard",
      duration: "7 days",
      category: "waste-reduction",
      deadline: "Dec 31, 2024",
      progress: 0,
      requirements: [
        "No single-use plastics",
        "Compost organic waste",
        "Reuse containers",
        "Document daily progress",
      ],
    },
    {
      id: 2,
      title: "30-Day Bike Commute",
      description:
        "Replace car trips with cycling for 30 days. Perfect for reducing carbon footprint and improving health.",
      points: 150,
      participants: 892,
      completedByUser: false,
      difficulty: "medium",
      duration: "30 days",
      category: "transportation",
      deadline: "Jan 15, 2025",
      progress: 0,
      requirements: [
        "Bike to work 3+ times/week",
        "Track distance",
        "Share route tips",
        "Log carbon savings",
      ],
    },
    {
      id: 3,
      title: "Plant a Tree",
      description:
        "Plant and nurture a tree in your community. Document its growth and inspire others to do the same.",
      points: 75,
      participants: 2156,
      completedByUser: true,
      difficulty: "easy",
      duration: "1 day + follow-up",
      category: "nature",
      deadline: "Ongoing",
      progress: 100,
      requirements: [
        "Choose appropriate location",
        "Select native species",
        "Proper planting technique",
        "Monthly progress photos",
      ],
    },
  ]);

  const [userStats, setUserStats] = useState<UserStats>({
    points: 1250,
    challengesCompleted: 12,
    tipsShared: 23,
    carbonSaved: 340,
    streak: 15,
    rank: 156,
    badges: [
      "Early Adopter",
      "Tip Master",
      "Challenge Champion",
      "Eco Warrior",
    ],
    weeklyGoal: 50,
    weeklyProgress: 32,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Share your first eco tip",
      icon: "🌱",
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 2,
      title: "Tip Master",
      description: "Share 10 eco tips",
      icon: "💡",
      unlocked: true,
      progress: 10,
      maxProgress: 10,
    },
    {
      id: 3,
      title: "Challenge Seeker",
      description: "Complete 5 challenges",
      icon: "🏆",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
    },
    {
      id: 4,
      title: "Carbon Saver",
      description: "Save 500kg of CO₂",
      icon: "🌍",
      unlocked: false,
      progress: 340,
      maxProgress: 500,
    },
  ]);

  const [chartData] = useState([
    { name: "Jan", carbon: 45, energy: 120, waste: 30 },
    { name: "Feb", carbon: 52, energy: 110, waste: 25 },
    { name: "Mar", carbon: 48, energy: 105, waste: 28 },
    { name: "Apr", carbon: 61, energy: 95, waste: 22 },
    { name: "May", carbon: 55, energy: 85, waste: 20 },
    { name: "Jun", carbon: 67, energy: 75, waste: 18 },
  ]);

  const [impactData] = useState([
    { name: "Energy", value: 35, color: "#3b82f6" },
    { name: "Transport", value: 28, color: "#10b981" },
    { name: "Waste", value: 22, color: "#f59e0b" },
    { name: "Water", value: 15, color: "#06b6d4" },
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

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

  const bookmarkTip = (tipId: number) => {
    setTips(
      tips.map((tip) =>
        tip.id === tipId ? { ...tip, bookmarked: !tip.bookmarked } : tip
      )
    );
  };

  const shareTip = (tipId: number) => {
    const tip = tips.find((t) => t.id === tipId);
    if (tip) {
      navigator
        .share?.({
          title: "Eco Tip",
          text: tip.text,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(`${tip.text} - Shared from EcoConnect`);
          showNotification("Tip copied to clipboard!");
        });
    }
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

    const challenge = challenges.find(
      (c) => c.id === challengeId && !c.completedByUser
    );
    if (challenge) {
      const newPoints = userStats.points + challenge.points;
      setUserStats({
        ...userStats,
        points: newPoints,
        challengesCompleted: userStats.challengesCompleted + 1,
      });

      showNotification(`+${challenge.points} points earned!`);
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
        bookmarked: false,
        category: tipCategory,
        author: "You",
        avatar: "👤",
        timestamp: "Just now",
        comments: 0,
        shares: 0,
        difficulty: tipDifficulty,
        impact: tipImpact,
        tags: [],
      };
      setTips([newTipObj, ...tips]);
      setNewTip("");
      setTipCategory("general");
      setShowAddTipForm(false);

      setUserStats({
        ...userStats,
        tipsShared: userStats.tipsShared + 1,
      });

      showNotification("Tip shared successfully!");
    }
  };

  const showNotification = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const filterTips = () => {
    let filtered = tips;

    if (activeSubTab !== "all") {
      filtered = filtered.filter((tip) => tip.category === activeSubTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (tip) =>
          tip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tip.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.likes - a.likes);
      case "recent":
        return filtered.sort((a, b) => b.id - a.id);
      case "impact":
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return filtered.sort(
          (a, b) => impactOrder[b.impact] - impactOrder[a.impact]
        );
      default:
        return filtered;
    }
  };

  const getLevel = () => {
    if (userStats.points < 100) return "Eco Newbie";
    if (userStats.points < 500) return "Green Advocate";
    if (userStats.points < 1000) return "Eco Warrior";
    if (userStats.points < 2000) return "Eco Hero";
    return "Eco Legend";
  };

  const getLevelProgress = () => {
    const points = userStats.points;
    if (points < 100) return (points / 100) * 100;
    if (points < 500) return ((points - 100) / 400) * 100;
    if (points < 1000) return ((points - 500) / 500) * 100;
    if (points < 2000) return ((points - 1000) / 1000) * 100;
    return 100;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return darkMode ? "text-green-400" : "text-green-600";
      case "medium":
        return darkMode ? "text-yellow-400" : "text-yellow-600";
      case "hard":
        return darkMode ? "text-red-400" : "text-red-600";
      default:
        return darkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return darkMode ? "text-blue-400" : "text-blue-600";
      case "medium":
        return darkMode ? "text-purple-400" : "text-purple-600";
      case "high":
        return darkMode ? "text-orange-400" : "text-orange-600";
      default:
        return darkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-green-50"
        }`}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
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
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50"
      } font-sans transition-all duration-300`}
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`sticky top-0 z-40 backdrop-blur-md ${
          darkMode
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <Leaf size={40} className="text-green-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </motion.div>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  EcoConnect
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Building a sustainable future together
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <User size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-600 border border-blue-500/30"
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`mb-8 flex flex-wrap gap-2 p-2 rounded-xl ${
            darkMode ? "bg-gray-800/50" : "bg-white/50"
          } backdrop-blur-sm border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "tips", label: "Eco Tips", icon: Lightbulb },
            { id: "challenges", label: "Challenges", icon: Trophy },
            { id: "achievements", label: "Achievements", icon: Award },
            { id: "community", label: "Community", icon: Users },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? darkMode
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 text-white shadow-lg"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.nav>

        {/* Dashboard Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="text-yellow-300" size={24} />
                    <span className="text-2xl font-bold">
                      {userStats.points}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">Total Points</h3>
                  <p className="text-sm opacity-90">{getLevel()}</p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div
                      className="h-2 rounded-full bg-yellow-300"
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode
                      ? "bg-gradient-to-br from-green-600 to-green-700 text-white"
                      : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Target className="text-green-200" size={24} />
                    <span className="text-2xl font-bold">
                      {userStats.challengesCompleted}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">Challenges</h3>
                  <p className="text-sm opacity-90">Completed</p>
                  <div className="flex items-center mt-3">
                    <Zap className="text-yellow-300 mr-1" size={16} />
                    <span className="text-sm">
                      {userStats.streak} day streak
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                      : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="text-purple-200" size={24} />
                    <span className="text-2xl font-bold">
                      {userStats.carbonSaved}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">CO₂ Saved</h3>
                  <p className="text-sm opacity-90">Kilograms</p>
                  <div className="flex items-center mt-3">
                    <TrendingUp className="text-green-300 mr-1" size={16} />
                    <span className="text-sm">+12% this month</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode
                      ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
                      : "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Star className="text-orange-200" size={24} />
                    <span className="text-2xl font-bold">
                      #{userStats.rank}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">Global Rank</h3>
                  <p className="text-sm opacity-90">Top 5% worldwide</p>
                  <div className="flex items-center mt-3">
                    <ChevronUp className="text-green-300 mr-1" size={16} />
                    <span className="text-sm">+23 this week</span>
                  </div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Environmental Impact Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      />
                      <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          color: darkMode ? "#ffffff" : "#000000",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="carbon"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="energy"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="waste"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Impact Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          color: darkMode ? "#ffffff" : "#000000",
                        }}
                      />
                      <RechartsPieChart
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {impactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {impactData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Weekly Progress */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Weekly Goal Progress
                  </h3>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {userStats.weeklyProgress}/{userStats.weeklyGoal} points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{
                      width: `${
                        (userStats.weeklyProgress / userStats.weeklyGoal) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {Math.round(
                      (userStats.weeklyProgress / userStats.weeklyGoal) * 100
                    )}
                    % complete
                  </span>
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {userStats.weeklyGoal - userStats.weeklyProgress} points to
                    go
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Tips Tab */}
          {activeTab === "tips" && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tips Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h2
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Eco Tips Community
                  </h2>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Share and discover sustainable living tips
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTipForm(!showAddTipForm)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  } shadow-lg`}
                >
                  <Plus size={20} />
                  Share Your Tip
                </motion.button>
              </div>

              {/* Add Tip Form */}
              <AnimatePresence>
                {showAddTipForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={submitTip}
                    className={`mb-8 p-6 rounded-xl shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Share Your Eco Tip
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="lg:col-span-2">
                        <textarea
                          value={newTip}
                          onChange={(e) => setNewTip(e.target.value)}
                          placeholder="What's your eco-friendly tip? Be specific and helpful!"
                          className={`w-full p-4 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-green-400"
                              : "border-gray-300 focus:ring-2 focus:ring-green-500"
                          }`}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label
                            className={`block mb-2 font-semibold ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Category
                          </label>
                          <select
                            value={tipCategory}
                            onChange={(e) => setTipCategory(e.target.value)}
                            className={`w-full p-3 rounded-lg border ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="general">General</option>
                            <option value="energy-saving">Energy Saving</option>
                            <option value="daily-habits">Daily Habits</option>
                            <option value="nature">Nature & Wildlife</option>
                            <option value="waste-reduction">
                              Waste Reduction
                            </option>
                            <option value="transportation">
                              Transportation
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block mb-2 font-semibold ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Difficulty
                          </label>
                          <select
                            value={tipDifficulty}
                            onChange={(e) =>
                              setTipDifficulty(
                                e.target.value as "easy" | "medium" | "hard"
                              )
                            }
                            className={`w-full p-3 rounded-lg border ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block mb-2 font-semibold ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Impact
                          </label>
                          <select
                            value={tipImpact}
                            onChange={(e) =>
                              setTipImpact(
                                e.target.value as "low" | "medium" | "high"
                              )
                            }
                            className={`w-full p-3 rounded-lg border ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="low">Low Impact</option>
                            <option value="medium">Medium Impact</option>
                            <option value="high">High Impact</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={!newTip.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold ${
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
                        className={`px-6 py-3 rounded-lg font-semibold ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search tips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="impact">Highest Impact</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "all",
                  "energy-saving",
                  "daily-habits",
                  "nature",
                  "waste-reduction",
                  "transportation",
                ].map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSubTab(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeSubTab === category
                        ? darkMode
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category === "all"
                      ? "All Tips"
                      : category
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </motion.button>
                ))}
              </div>

              {/* Tips List */}
              <div className="space-y-6">
                {filterTips().map((tip) => (
                  <motion.div
                    key={tip.id}
                    whileHover={{ y: -2 }}
                    className={`p-6 rounded-xl shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {tip.avatar}
                        </div>
                        <div>
                          <h4
                            className={`font-semibold ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {tip.author}
                          </h4>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {tip.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                            tip.difficulty
                          )} bg-opacity-20`}
                        >
                          {tip.difficulty}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getImpactColor(
                            tip.impact
                          )} bg-opacity-20`}
                        >
                          {tip.impact} impact
                        </span>
                      </div>
                    </div>

                    <p
                      className={`text-lg mb-4 leading-relaxed ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {tip.text}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {tip.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {tip.category.replace("-", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => likeTip(tip.id)}
                          className={`flex items-center space-x-1 ${
                            tip.likedByUser
                              ? "text-red-500"
                              : darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={tip.likedByUser ? "currentColor" : "none"}
                          />
                          <span>{tip.likes}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center space-x-1 ${
                            darkMode
                              ? "text-gray-400 hover:text-blue-400"
                              : "text-gray-500 hover:text-blue-500"
                          }`}
                        >
                          <MessageCircle size={18} />
                          <span>{tip.comments}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareTip(tip.id)}
                          className={`flex items-center space-x-1 ${
                            darkMode
                              ? "text-gray-400 hover:text-green-400"
                              : "text-gray-500 hover:text-green-500"
                          }`}
                        >
                          <Share2 size={18} />
                          <span>{tip.shares}</span>
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => bookmarkTip(tip.id)}
                        className={`${
                          tip.bookmarked
                            ? "text-yellow-500"
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        <Bookmark
                          size={18}
                          fill={tip.bookmarked ? "currentColor" : "none"}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Eco Challenges
                  </h2>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Take on challenges to make a bigger impact
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-6 rounded-xl shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            challenge.difficulty === "easy"
                              ? "bg-green-500"
                              : challenge.difficulty === "medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            challenge.difficulty === "easy"
                              ? "text-green-500"
                              : challenge.difficulty === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {challenge.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          darkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {challenge.points} pts
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-2 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {challenge.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {challenge.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Duration:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-gray-800"}
                        >
                          {challenge.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Deadline:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-gray-800"}
                        >
                          {challenge.deadline}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Participants:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-gray-800"}
                        >
                          {challenge.participants}
                        </span>
                      </div>
                    </div>

                    {challenge.completedByUser && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Requirements:
                      </h4>
                      <ul className="space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li
                            key={index}
                            className={`text-xs flex items-center ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <CheckCircle
                              size={12}
                              className="text-green-500 mr-2"
                            />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => joinChallenge(challenge.id)}
                      className={`w-full py-3 rounded-lg font-semibold ${
                        challenge.completedByUser
                          ? darkMode
                            ? "bg-green-800 text-green-300"
                            : "bg-green-100 text-green-800"
                          : darkMode
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {challenge.completedByUser
                        ? "✓ Joined"
                        : "Join Challenge"}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Achievements
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track your progress and unlock new badges
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-6 rounded-xl shadow-lg ${
                      achievement.unlocked
                        ? darkMode
                          ? "bg-gradient-to-br from-yellow-600 to-yellow-700"
                          : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                        : darkMode
                        ? "bg-gray-800"
                        : "bg-white"
                    } border ${
                      achievement.unlocked
                        ? "border-yellow-400"
                        : darkMode
                        ? "border-gray-700"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div
                        className={`text-4xl mb-2 ${
                          achievement.unlocked ? "grayscale-0" : "grayscale"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <h3
                        className={`text-lg font-bold ${
                          achievement.unlocked
                            ? "text-white"
                            : darkMode
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          achievement.unlocked
                            ? "text-yellow-100"
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>

                    {!achievement.unlocked && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-yellow-500"
                            style={{
                              width: `${
                                (achievement.progress /
                                  achievement.maxProgress) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-center text-sm font-semibold ${
                        achievement.unlocked
                          ? "text-yellow-100"
                          : darkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {achievement.unlocked ? "UNLOCKED" : "IN PROGRESS"}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Community Tab */}
          {activeTab === "community" && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Community
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Connect with fellow eco-warriors worldwide
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Community Stats */}
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Global Impact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        Active Members
                      </span>
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        12,847
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        Tips Shared
                      </span>
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        45,231
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        CO₂ Saved
                      </span>
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        2.3M kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        Countries
                      </span>
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        156
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Contributors */}
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Top Contributors
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "EcoWarrior", points: 2450, avatar: "🌱" },
                      { name: "GreenThumb", points: 2180, avatar: "🌿" },
                      { name: "ClimateHero", points: 1950, avatar: "🌍" },
                      { name: "You", points: userStats.points, avatar: "👤" },
                    ].map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{user.avatar}</span>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {user.name}
                          </span>
                        </div>
                        <span
                          className={`font-bold ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {user.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Activity className="text-green-500" size={16} />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Sarah completed "Zero Waste Week"
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="text-yellow-500" size={16} />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Mike shared a new energy tip
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy className="text-orange-500" size={16} />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Alex earned "Tip Master" badge
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="text-blue-500" size={16} />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        15 new members joined today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className={`fixed bottom-20 right-6 p-3 rounded-full shadow-lg z-50 ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notification Toast */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3 ${
                darkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
              <span className="font-medium">{celebrationMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className={`mt-16 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-t`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Leaf size={32} className="text-green-500 mr-2" />
                <h3
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  EcoConnect
                </h3>
              </div>
              <p
                className={`text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Building a sustainable future together through community-driven
                environmental action.
              </p>
              <div className="flex space-x-3">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Twitter size={18} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Instagram size={18} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Github size={18} />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  "Dashboard",
                  "Eco Tips",
                  "Challenges",
                  "Achievements",
                  "Community",
                ].map((link) => (
                  <li key={link}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#"
                      className={`text-sm ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Resources
              </h4>
              <ul className="space-y-2">
                {[
                  "Getting Started",
                  "Best Practices",
                  "Impact Calculator",
                  "API Documentation",
                  "Help Center",
                ].map((link) => (
                  <li key={link}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#"
                      className={`text-sm ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Get in Touch
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail
                    size={16}
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    hello@ecoconnect.com
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin
                    size={16}
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Global Community
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={16}
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    156 Countries
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mt-8 pt-8 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex flex-col md:flex-row justify-between items-center`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © 2024 EcoConnect. All rights reserved. Made with 💚 for the
              planet.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Terms of Service
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default EcoFriendlyApp;
