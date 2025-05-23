"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Poppins } from "next/font/google"
import { Moon, Sun, Home, UserIcon, LogIn, Menu, X, Heart, MessageCircle, Share2, Send, Edit } from "lucide-react"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})
interface Like {
  id: number
  userId: number
}
interface Feeling {
  id: number
  title: string
  description: string
  category: "happy" | "sad" | "angry" | "inspired" | "grateful" | "curious"
  date: string
  userId: number
  likes: Like[],
}

interface UserProfile {
  id: number
  name: string
  avatar: string
  bio: string
}

interface Reply {
  id: number
  feelingId: number
  userId: number
  message: string
  date: string
}
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      button, 
      [role="button"],
      a,
      .clickable,
      input[type="submit"],
      input[type="button"],
      input[type="reset"],
      select,
      summary,
      [tabindex]:not([tabindex="-1"]) {
        cursor: pointer;
      }
      
      input, 
      textarea {
        cursor: text;
      }
      
      select {
        cursor: pointer;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return null
}
const ClientDate = ({ dateString }: { dateString: string }) => {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString())
  }, [dateString])

  return <span>{formattedDate}</span>
}

const FeelingCard = ({
  feeling,
  user,
  onLike,
  onReply,
  replies,
  users,
  currentUser,
  isDarkMode,
}: {
  feeling: Feeling
  user: UserProfile
  onLike: (like: Like) => void
  onReply: (feeling: Feeling) => void
  replies: Reply[]
  users: UserProfile[]
  currentUser: UserProfile | null
  isDarkMode: boolean
}) => {
  const [showReplies, setShowReplies] = useState(false)
  const feelingReplies = replies.filter((reply) => reply.feelingId === feeling.id)

  const categoryColors = {
    happy: isDarkMode
      ? "bg-gradient-to-br from-amber-900/30 to-amber-800/30 border border-amber-700"
      : "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200",
    sad: isDarkMode
      ? "bg-gradient-to-br from-sky-900/30 to-sky-800/30 border border-sky-700"
      : "bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200",
    angry: isDarkMode
      ? "bg-gradient-to-br from-rose-900/30 to-rose-800/30 border border-rose-700"
      : "bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200",
    inspired: isDarkMode
      ? "bg-gradient-to-br from-violet-900/30 to-violet-800/30 border border-violet-700"
      : "bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200",
    grateful: isDarkMode
      ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-700"
      : "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200",
    curious: isDarkMode
      ? "bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-700"
      : "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200",
  }

  const textColors = {
    happy: isDarkMode ? "text-amber-300" : "text-amber-800",
    sad: isDarkMode ? "text-sky-300" : "text-sky-800",
    angry: isDarkMode ? "text-rose-300" : "text-rose-800",
    inspired: isDarkMode ? "text-violet-300" : "text-violet-800",
    grateful: isDarkMode ? "text-emerald-300" : "text-emerald-800",
    curious: isDarkMode ? "text-orange-300" : "text-orange-800",
  }

  const accentColors = {
    happy: isDarkMode ? "bg-amber-600" : "bg-amber-500",
    sad: isDarkMode ? "bg-sky-600" : "bg-sky-500",
    angry: isDarkMode ? "bg-rose-600" : "bg-rose-500",
    inspired: isDarkMode ? "bg-violet-600" : "bg-violet-500",
    grateful: isDarkMode ? "bg-emerald-600" : "bg-emerald-500",
    curious: isDarkMode ? "bg-orange-600" : "bg-orange-500",
  }
  const isLikedByUser = (feeling: Feeling, userId: number | undefined) => {
    return !!userId && !!feeling.likes.find((like) => like.userId === userId)
  }
  const isRepliedByUser = (feelingId: number | undefined, userId: number | undefined) => {
    return !!feelingId && !!userId && !!replies.find((reply) => reply.userId === userId && reply.feelingId === feelingId)
  }
  const handleActionClick = (action: string) => {
    if (!currentUser) {
      alert("Please create an account first to perform this action!")
      return
    }

    if (action === "like") {
      onLike({
        id: feeling.id,
        userId: currentUser.id})
    } else if (action === "reply") {
      onReply(feeling)
    } else if (action === "share") {
      alert("Share functionality coming soon! 🚀")
    }
  }

  return (
    <div
      className={`backdrop-blur-lg ${
        isDarkMode ? "bg-gray-800/90" : "bg-white/90"
      } rounded-2xl p-6 shadow-lg ${categoryColors[feeling.category]} transition-all duration-300 hover:shadow-xl`}
    >
      <GlobalStyle />
      <div className="flex items-start gap-5">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
            accentColors[feeling.category]
          } shadow-md`}
        >
          <span className="text-xl">
            {feeling.category === "happy" && "😊"}
            {feeling.category === "sad" && "😢"}
            {feeling.category === "angry" && "😠"}
            {feeling.category === "inspired" && "✨"}
            {feeling.category === "grateful" && "🙏"}
            {feeling.category === "curious" && "🤔"}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xl font-bold ${textColors[feeling.category]}`}>{feeling.title}</h3>
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              <ClientDate dateString={feeling.date} />
            </span>
          </div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-4`}>{feeling.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {user.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              

              <button
                onClick={() => handleActionClick("like")}
                className={`flex items-center gap-1 ${
                  isLikedByUser(feeling, currentUser?.id)
                    ? isDarkMode
                      ? "text-rose-400 hover:text-rose-300"
                      : "text-rose-500 hover:text-rose-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-rose-400"
                    : "text-gray-500 hover:text-rose-500"
                } transition-colors`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs">{feeling.likes.length}</span>
              </button>
              <button
                onClick={() => handleActionClick("reply")}
                className={`flex items-center gap-1 ${
                  isRepliedByUser(feeling?.id, currentUser?.id)
                    ? isDarkMode
                      ? "text-rose-400 hover:text-rose-300"
                      : "text-rose-500 hover:text-rose-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-rose-400"
                    : "text-gray-500 hover:text-rose-500"
                } transition-colors`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{feelingReplies.length}</span>
              </button>
              <button
                onClick={() => handleActionClick("share")}
                className={`${
                  isDarkMode ? "text-gray-400 hover:text-emerald-400" : "text-gray-500 hover:text-emerald-500"
                } transition-colors`}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Replies Section */}
          {feelingReplies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className={`text-sm ${
                  isDarkMode ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"
                } transition-colors`}
              >
                {showReplies ? "Hide" : "Show"} {feelingReplies.length}{" "}
                {feelingReplies.length === 1 ? "reply" : "replies"}
              </button>

              {showReplies && (
                <div className="mt-3 space-y-3">
                  {feelingReplies.map((reply) => {
                    const replyUser = users.find((u) => u.id === reply.userId)
                    return (
                      <div
                        key={reply.id}
                        className={`${
                          isDarkMode ? "bg-gray-700/50" : "bg-gray-50/80"
                        } rounded-lg p-3 border-l-4 border-teal-500`}
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${replyUser?.name}&background=random&size=24`}
                            alt={replyUser?.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {replyUser?.name}
                              </span>
                              <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                <ClientDate dateString={reply.date} />
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {reply.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MoodWave = () => {
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [filteredFeelings, setFilteredFeelings] = useState<Feeling[]>([])
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [newFeeling, setNewFeeling] = useState({
    title: "",
    description: "",
    category: "happy" as "happy" | "sad" | "angry" | "inspired" | "grateful" | "curious",
  })
  const [editProfile, setEditProfile] = useState({
    name: "",
    bio: "",
  })
  const [replyMessage, setReplyMessage] = useState("")
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"all" | "user">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const categories = [
    { name: "Happy", value: "happy" },
    { name: "Sad", value: "sad" },
    { name: "Angry", value: "angry" },
    { name: "Inspired", value: "inspired" },
    { name: "Grateful", value: "grateful" },
    { name: "Curious", value: "curious" },
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  useEffect(() => {
    setIsClient(true)
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(localStorage.getItem("darkMode") === "true" || prefersDark)

    const savedUser = localStorage.getItem("moodwave-user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("darkMode", isDarkMode ? "true" : "false")
    }
  }, [isDarkMode, isClient])

  useEffect(() => {
    if (isClient && currentUser) {
      localStorage.setItem("moodwave-user", JSON.stringify(currentUser))
    }
  }, [currentUser, isClient])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const feelingsData: Feeling[] = [
        {
          id: 1,
          title: "Today was amazing!",
          description: "I had a great day at work and spent time with friends in the evening.",
          category: "happy",
          date: new Date().toISOString(),
          userId: 1,
          likes: [
        { id: 1, userId: 2 },
        { id: 2, userId: 3 },
          ],
        },
        {
          id: 2,
          title: "Feeling a bit down",
          description: "Missed my family today. Wishing I could see them soon.",
          category: "sad",
          date: new Date().toISOString(),
          userId: 2,
          likes: [{ id: 3, userId: 1 }],
        },
        {
          id: 3,
          title: "Inspired by nature",
          description: "Went for a hike today and felt so connected to the world around me.",
          category: "inspired",
          date: new Date().toISOString(),
          userId: 1,
          likes: [
        { id: 4, userId: 2 },
        { id: 5, userId: 3 },
          ],
        },
        {
          id: 4,
          title: "Grateful for my health",
          description: "Had a check-up today and everything is great. Feeling blessed.",
          category: "grateful",
          date: new Date().toISOString(),
          userId: 3,
          likes: [],
        },
        {
          id: 5,
          title: "Curious about new technologies",
          description: "Just discovered some fascinating AI tools that could change how we work.",
          category: "curious",
          date: new Date(Date.now() - 86400000).toISOString(),
          userId: 2,
          likes: [],
        },
        {
          id: 6,
          title: "Frustrated with traffic",
          description: "Spent two hours in traffic today. City planning needs serious improvement!",
          category: "angry",
          date: new Date(Date.now() - 172800000).toISOString(),
          userId: 3,
          likes: [],
        },
      ]

      const usersData = [
        {
          id: 1,
          name: "Alex Johnson",
          avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random",
          bio: "Software engineer | Nature lover | Coffee enthusiast",
        },
        {
          id: 2,
          name: "Sarah Williams",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=random",
          bio: "Writer | Traveler | Foodie",
        },
        {
          id: 3,
          name: "Michael Chen",
          avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
          bio: "Designer | Music lover | Dog dad",
        },
      ]

      const repliesData = [
        {
          id: 1,
          feelingId: 1,
          userId: 2,
          message: "That sounds wonderful! I'm so happy for you! 😊",
          date: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          feelingId: 1,
          userId: 3,
          message: "Great to hear! Hope you have many more days like this.",
          date: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 3,
          feelingId: 2,
          userId: 1,
          message: "Sending you virtual hugs! Family is so important. ❤️",
          date: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 4,
          feelingId: 6,
          userId: 1,
          message: "I totally feel you! Traffic can be so frustrating. Maybe try some calming music?",
          date: new Date(Date.now() - 86400000).toISOString(),
        },
      ]

      setFeelings(feelingsData)
      setUsers(usersData)
      setReplies(repliesData)
      setFilteredFeelings(feelingsData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let result = [...feelings]

    if (selectedCategories.length > 0) {
      result = result.filter((feeling) => selectedCategories.includes(feeling.category))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (feeling) => feeling.title.toLowerCase().includes(query) || feeling.description.toLowerCase().includes(query),
      )
    }

    if (viewMode === "user" && currentUser) {
      result = result.filter((feeling) => feeling.userId === currentUser.id)
    }

    setFilteredFeelings(result)
  }, [selectedCategories, viewMode, currentUser, feelings, searchQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFeeling.title.trim() || !newFeeling.description.trim()) return

    if (!currentUser) {
      setErrorMessage("Please create an account first to share your feelings")
      ;(document.getElementById("add-feeling-modal") as HTMLDialogElement).close()
      return
    }

    const feelingToAdd: Feeling = {
      id: feelings.length + 1,
      title: newFeeling.title,
      description: newFeeling.description,
      category: newFeeling.category,
      date: new Date().toISOString(),
      userId: currentUser.id,
      likes: [],
    }

    setFeelings([feelingToAdd, ...feelings])
    setNewFeeling({ title: "", description: "", category: "happy" })

    const modal = document.getElementById("add-feeling-modal") as HTMLDialogElement
    if (modal) modal.close()

    setErrorMessage(null)
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyMessage.trim() || !selectedFeeling) return

    if (!currentUser) {
      setErrorMessage("Please create an account first to reply")
      ;(document.getElementById("reply-modal") as HTMLDialogElement).close()
      return
    }

    const newReply: Reply = {
      id: replies.length + 1,
      feelingId: selectedFeeling.id,
      userId: currentUser.id,
      message: replyMessage,
      date: new Date().toISOString(),
    }

    setReplies([...replies, newReply])
    setReplyMessage("")
    setSelectedFeeling(null)

    const modal = document.getElementById("reply-modal") as HTMLDialogElement
    if (modal) modal.close()

    setErrorMessage(null)
  }

  const handleReply = (feeling: Feeling) => {
    if (!currentUser) {
      setErrorMessage("Please create an account first to reply")
      return
    }
    setSelectedFeeling(feeling)
    ;(document.getElementById("reply-modal") as HTMLDialogElement).showModal()
  }

  const handleViewModeChange = (mode: "all" | "user") => {
    if (mode === "user" && !currentUser) {
      setErrorMessage("Please create an account first to view your feelings")
      return
    }

    setViewMode(mode)
    setErrorMessage(null)
  }

  const handleCreateUser = (newUser: UserProfile) => {
    const userWithId = { ...newUser, id: Date.now() }
    setUsers([...users, userWithId])
    setCurrentUser(userWithId)
    setErrorMessage(null)
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      name: editProfile.name,
      bio: editProfile.bio,
      avatar: `https://ui-avatars.com/api/?name=${editProfile.name}&background=random`,
    }

    setCurrentUser(updatedUser)
    setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)))

    const modal = document.getElementById("edit-profile-modal") as HTMLDialogElement
    if (modal) modal.close()
  }

  const handleEditProfile = () => {
    if (!currentUser) return
    setEditProfile({
      name: currentUser.name,
      bio: currentUser.bio,
    })
    ;(document.getElementById("edit-profile-modal") as HTMLDialogElement).showModal()
  }

  const handleLike = (like: Like) => {
    setFeelings(feelings.map((feeling) => 
    {
      if (feeling.id === like.id) {
        if (!!feeling.likes.findLast((l) => l.userId === like.userId)) {
          return { ...feeling, likes: feeling.likes.filter((l) => l.userId !== like.userId) }
        }
        return { ...feeling, likes: feeling.likes.concat(like) }
      }
      return feeling
    }))
  }

  const handleDeleteAccount = () => {
    setCurrentUser(null)
    setViewMode("all")
    localStorage.removeItem("moodwave-user")
    setErrorMessage(null)
  }

  const handlePlaceholderClick = (buttonName: string) => {
    alert(`${buttonName} functionality coming soon! 🚀`)
  }

  const handleAuthRequiredAction = (action: string) => {
    if (!currentUser) {
      setErrorMessage("Please create an account first to perform this action")
      return false
    }
    return true
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 text-black"
      } ${poppins.className}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${
          isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"
        } backdrop-blur-lg border-b`}
      >
        <div className="container mx-auto px-4 py-3 max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode ? "from-teal-400 to-cyan-400" : "from-teal-600 to-cyan-600"
                }`}
              >
                MoodWave
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleViewModeChange("all")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "all"
                    ? isDarkMode
                      ? "bg-teal-900/50 text-teal-300"
                      : "bg-teal-100 text-teal-700"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleViewModeChange("user")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "user"
                    ? isDarkMode
                      ? "bg-teal-900/50 text-teal-300"
                      : "bg-teal-100 text-teal-700"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>My Feelings</span>
              </button>
              <button
                onClick={() => {
                  if (handleAuthRequiredAction("share feeling")) {
                    ;(document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Share Feeling</span>
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  handleViewModeChange("all")
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "all"
                    ? isDarkMode
                      ? "bg-teal-900/50 text-teal-300"
                      : "bg-teal-100 text-teal-700"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  handleViewModeChange("user")
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "user"
                    ? isDarkMode
                      ? "bg-teal-900/50 text-teal-300"
                      : "bg-teal-100 text-teal-700"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>My Feelings</span>
              </button>
              <button
                onClick={() => {
                  if (handleAuthRequiredAction("share feeling")) {
                    ;(document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()
                  }
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Share Feeling</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Error Message */}
        {errorMessage && (
          <div
            className={`mb-6 p-4 ${
              isDarkMode ? "bg-rose-900/30 text-rose-300 border-rose-800" : "bg-rose-100 text-rose-700 border-rose-200"
            } rounded-xl border`}
          >
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className={`mt-2 text-sm ${
                isDarkMode ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
              } underline`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <div
                className={`${
                  isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
                } backdrop-blur-lg rounded-xl shadow-sm border p-4 mb-6`}
              >
                <h2 className={`text-xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
                  {currentUser ? "Your Profile" : "Welcome to MoodWave"}
                </h2>

                {currentUser ? (
                  <div className="flex flex-col items-center text-center gap-3 p-4">
                    <div
                      className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                        isDarkMode ? "border-teal-900" : "border-teal-100"
                      }`}
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=random&size=80`}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {currentUser.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                        {currentUser.bio}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={handleEditProfile}
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        } border transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className={`px-3 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-rose-900/30 text-rose-300 border-rose-800 hover:bg-rose-900/50"
                            : "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200"
                        } border transition-all duration-300`}
                      >
                        DeleteAccount
                      </button>
                    </div>
                    <button
                      onClick={() => (document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()}
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                    >
                      Share a Feeling
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                      Create your account to start sharing your feelings and connecting with others.
                    </p>
                    <button
                      onClick={() => (document.getElementById("create-user-modal") as HTMLDialogElement).showModal()}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LogIn className="w-4 h-4" />
                        <span>Create Account</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div
                className={`${
                  isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
                } backdrop-blur-lg rounded-xl shadow-sm border p-4`}
              >
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
                  Filters
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
                    >
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => toggleCategory(category.value)}
                          className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                            selectedCategories.includes(category.value)
                              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                              : isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
                    >
                      View
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewModeChange("all")}
                        className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                          viewMode === "all"
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                            : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleViewModeChange("user")}
                        className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                          viewMode === "user"
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                            : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        My Feelings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search feelings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full p-3 pl-4 pr-10 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800/90 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-teal-400"
                      : "bg-white/90 border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-teal-500"
                  } backdrop-blur-lg border focus:outline-none focus:ring-2 transition-all duration-300`}
                />
                <button
                  onClick={() => {
                    if (handleAuthRequiredAction("share feeling")) {
                      ;(document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Feelings Feed */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`${
                      isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
                    } backdrop-blur-lg rounded-xl p-6 shadow-sm border animate-pulse`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                      <div className="flex-1">
                        <div className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded w-3/4 mb-3`}></div>
                        <div className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded w-1/2 mb-4`}></div>
                        <div className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded w-full mb-2`}></div>
                        <div className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded w-3/4`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFeelings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredFeelings.map((feeling) => {
                  const user = users.find((u) => u.id === feeling.userId)
                  return (
                    user && (
                      <FeelingCard
                        key={feeling.id}
                        feeling={feeling}
                        user={user}
                        onLike={handleLike}
                        onReply={handleReply}
                        replies={replies}
                        users={users}
                        currentUser={currentUser}
                        isDarkMode={isDarkMode}
                      />
                    )
                  )
                })}
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
                } backdrop-blur-lg rounded-xl p-8 shadow-sm border text-center`}
              >
                <div className="text-5xl mb-4">🔍</div>
                <div className={`text-xl font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  No feelings found
                </div>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
                  {currentUser
                    ? "Try adjusting your filters or share your own feeling"
                    : "Create an account to start sharing your feelings"}
                </p>
                {currentUser ? (
                  <button
                    onClick={() => (document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Share a Feeling
                  </button>
                ) : (
                  <button
                    onClick={() => (document.getElementById("create-user-modal") as HTMLDialogElement).showModal()}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Create Account
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"
        } backdrop-blur-lg border-t mt-12`}
      >
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div
                className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode ? "from-teal-400 to-cyan-400" : "from-teal-600 to-cyan-600"
                }`}
              >
                MoodWave
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Connect through shared emotions
              </p>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => handlePlaceholderClick("About")}
                className={`${isDarkMode ? "text-gray-400 hover:text-teal-400" : "text-gray-500 hover:text-teal-500"} transition-colors`}
              >
                About
              </button>
              <button
                onClick={() => handlePlaceholderClick("Privacy")}
                className={`${isDarkMode ? "text-gray-400 hover:text-teal-400" : "text-gray-500 hover:text-teal-500"} transition-colors`}
              >
                Privacy
              </button>
              <button
                onClick={() => handlePlaceholderClick("Terms")}
                className={`${isDarkMode ? "text-gray-400 hover:text-teal-400" : "text-gray-500 hover:text-teal-500"} transition-colors`}
              >
                Terms
              </button>
              <button
                onClick={() => handlePlaceholderClick("Contact")}
                className={`${isDarkMode ? "text-gray-400 hover:text-teal-400" : "text-gray-500 hover:text-teal-500"} transition-colors`}
              >
                Contact
              </button>
            </div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              © 2023 MoodWave. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Add Feeling Modal */}
      <dialog
        id="add-feeling-modal"
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
            } backdrop-blur-sm border p-6 rounded-xl max-w-md w-full shadow-xl`}
          >
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
              Share Your Feeling
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newFeeling.title}
                    onChange={(e) => setNewFeeling({ ...newFeeling, title: e.target.value })}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Description
                  </label>
                  <textarea
                    value={newFeeling.description}
                    onChange={(e) => setNewFeeling({ ...newFeeling, description: e.target.value })}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Category
                  </label>
                  <select
                    value={newFeeling.category}
                    onChange={(e) => setNewFeeling({ ...newFeeling, category: e.target.value as any })}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => (document.getElementById("add-feeling-modal") as HTMLDialogElement).close()}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Reply Modal */}
      <dialog
        id="reply-modal"
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
            } backdrop-blur-sm border p-6 rounded-xl max-w-lg w-full shadow-xl`}
          >
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
              Reply to Feeling
            </h3>

            {selectedFeeling && (
              <div
                className={`${isDarkMode ? "bg-gray-800/50" : "bg-gray-50/80"} rounded-lg p-4 mb-4 border-l-4 border-teal-500`}
              >
                <h4 className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-2`}>
                  {selectedFeeling.title}
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {selectedFeeling.description}
                </p>
              </div>
            )}

            <form onSubmit={handleReplySubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Your Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    rows={4}
                    placeholder="Share your thoughts and support..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    ;(document.getElementById("reply-modal") as HTMLDialogElement).close()
                    setReplyMessage("")
                    setSelectedFeeling(null)
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Create User Modal */}
      <dialog
        id="create-user-modal"
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
            } backdrop-blur-sm border p-6 rounded-xl max-w-md w-full shadow-xl`}
          >
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
              Create Your Profile
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const newUser: UserProfile = {
                  id: Date.now(),
                  name: form.name.value,
                  avatar: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`,
                  bio: form.bio.value,
                }
                handleCreateUser(newUser)
                ;(document.getElementById("create-user-modal") as HTMLDialogElement).close()
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    rows={2}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => (document.getElementById("create-user-modal") as HTMLDialogElement).close()}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit Profile Modal */}
      <dialog
        id="edit-profile-modal"
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
            } backdrop-blur-sm border p-6 rounded-xl max-w-md w-full shadow-xl`}
          >
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>
              Edit Your Profile
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Bio
                  </label>
                  <textarea
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-400"
                        : "bg-white border-gray-200 text-gray-700 focus:ring-teal-500"
                    } border focus:ring-2 focus:outline-none`}
                    rows={2}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => (document.getElementById("edit-profile-modal") as HTMLDialogElement).close()}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default MoodWave
