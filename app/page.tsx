"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSwipeable } from "react-swipeable"
import {
  FaSmile,
  FaSadTear,
  FaAngry,
  FaFlushed,
  FaRegSmile,
  FaLaugh,
  FaMeh,
  FaPlusCircle,
  FaReply,
  FaTimes,
  FaMagic,
  FaSun,
  FaMoon,
  FaHeart,
  FaShare,
  FaBookmark,
  FaRegLightbulb,
  FaRegCommentDots,
  FaRegClock,
} from "react-icons/fa"

type MoodType = "happy" | "sad" | "angry" | "anxious" | "relaxed" | "excited" | "grateful"

interface MoodPost {
  id: string
  username: string
  mood: MoodType
  message: string
  timestamp: number
  expiresAt: number
  replies?: Reply[]
  likes: number
  isLiked?: boolean
  isSaved?: boolean
}

interface Reply {
  id: string
  username: string
  message: string
  timestamp: number
  likes?: number
}

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

const loadingTips = [
  "Tip: Keep your messages concise and authentic",
  "Did you know? Sharing moods helps build empathy",
  "Remember: All posts disappear after 24 hours",
  "Pro tip: Swipe left on posts to dismiss them",
  "Fun fact: Your username is randomly generated",
  "Challenge yourself with our weekly mood activities",
  "Need support? Check our mental health resources",
]

const moodIcons = {
  happy: FaSmile,
  sad: FaSadTear,
  angry: FaAngry,
  anxious: FaFlushed,
  relaxed: FaRegSmile,
  excited: FaLaugh,
  grateful: FaMeh,
}

const moodColors = {
  happy: "text-yellow-500",
  sad: "text-blue-500",
  angry: "text-red-500",
  anxious: "text-orange-500",
  relaxed: "text-green-500",
  excited: "text-purple-500",
  grateful: "text-pink-500",
}

const moodBgColors = {
  happy: "bg-yellow-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  anxious: "bg-orange-500",
  relaxed: "bg-green-500",
  excited: "bg-purple-500",
  grateful: "bg-pink-500",
}

const generateUsername = () => {
  const adjectives = [
    "Mystic",
    "Serene",
    "Vivid",
    "Gentle",
    "Radiant",
    "Cosmic",
    "Dreamy",
    "Ethereal",
    "Tranquil",
    "Vibrant",
  ]
  const nouns = ["Whisper", "Horizon", "Moment", "Essence", "Bloom", "Nebula", "Breeze", "Ripple", "Echo", "Spark"]
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
    nouns[Math.floor(Math.random() * nouns.length)]
  }${Math.floor(100 + Math.random() * 900)}`
}

const PostModal = ({
  post,
  onClose,
  onReply,
  replyMessage,
  setReplyMessage,
  isDarkMode,
  onLike,
  onSave,
}: {
  post: MoodPost
  onClose: () => void
  onReply: () => void
  replyMessage: string
  setReplyMessage: (msg: string) => void
  isDarkMode: boolean
  onLike: () => void
  onSave: () => void
}) => {
  const Icon = moodIcons[post.mood]
  const colorClass = moodColors[post.mood]
  const bgColorClass = moodBgColors[post.mood]
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-black/70" : "bg-black/30"
      } backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn z-50`}
    >
      <div
        ref={modalRef}
        className={`${
          isDarkMode ? "bg-gray-800/90 text-white border-gray-700" : "bg-white/90 text-gray-800 border-gray-200"
        } rounded-2xl backdrop-blur-lg border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-2xl font-bold`}>Post Conversation</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-xl ${bgColorClass} bg-opacity-20 border border-opacity-30 ${bgColorClass.replace(
                  "bg-",
                  "border-",
                )}`}
              >
                <Icon className={`text-2xl ${colorClass}`} />
              </div>
              <div>
                <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-lg font-semibold`}>
                  {post.username}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date(post.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <p className={`${isDarkMode ? "text-white" : "text-gray-700"} text-base leading-relaxed`}>{post.message}</p>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  post.isLiked
                    ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                <FaHeart className={post.isLiked ? "text-red-500" : "text-gray-400"} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={onSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  post.isSaved
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                <FaBookmark className={post.isSaved ? "text-blue-500" : "text-gray-400"} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-auto">
                <FaShare className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your response..."
                className={`${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 placeholder:text-gray-400"
                    : "bg-white border-gray-200 placeholder:text-gray-500"
                } w-full p-4 rounded-xl border focus:border-purple-300 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none`}
                rows={3}
              />
              <button
                onClick={onReply}
                disabled={!replyMessage.trim()}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
              >
                Post Response
              </button>
            </div>

            <div className="space-y-6">
              <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>
                {post.replies && post.replies.length > 0 ? `Responses (${post.replies.length})` : "No responses yet"}
              </h3>

              {post.replies?.map((reply) => (
                <div key={reply.id} className={`pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${isDarkMode ? "text-white" : "text-gray-700"} text-sm font-semibold`}>
                      {reply.username}
                    </span>
                    <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs font-medium`}>
                      {new Date(reply.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm leading-relaxed`}>
                    {reply.message}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <FaHeart className="text-xs" />
                      <span>{reply.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <FaReply className="text-xs" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const hasMounted = useHasMounted()
  const [posts, setPosts] = useState<MoodPost[]>([])
  const [newPostMessage, setNewPostMessage] = useState("")
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [selectedPost, setSelectedPost] = useState<MoodPost | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [currentMood, setCurrentMood] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const initializeClientData = () => {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const savedTheme = localStorage.getItem("moodSphereTheme")
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark")
      } else if (prefersDark) {
        setIsDarkMode(true)
      }

      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % loadingTips.length)
      }, 4000)

      const moodInterval = setInterval(() => {
        setCurrentMood((prev) => (prev + 1) % Object.keys(moodIcons).length)
      }, 1000)

      setTimeout(() => {
        setIsLoading(false)
        clearInterval(tipInterval)
        clearInterval(moodInterval)
      }, 2500)

      return () => {
        clearInterval(tipInterval)
        clearInterval(moodInterval)
      }
    }

    initializeClientData()
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      try {
        localStorage.setItem("moodPosts", JSON.stringify(posts))
      } catch (error) {
        console.error("Error saving posts to localStorage:", error)
      }
    }
  }, [posts])

  useEffect(() => {
    try {
      localStorage.setItem("moodSphereTheme", isDarkMode ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }
  }, [isDarkMode])

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true)
      const postElement = e.event.target?.closest(".post-item") as HTMLElement | null
      if (postElement) {
        const postWidth = postElement.offsetWidth
        const delta = Math.min(e.deltaX, 0)
        const translateX = Math.max(delta, -postWidth * 0.33)
        postElement.style.transform = `translateX(${translateX}px)`

        const opacity = 1 - Math.min(Math.abs(translateX) / (postWidth * 0.33), 0.5)
        postElement.style.opacity = opacity.toString()
      }
    },
    onSwiped: (e) => {
      setIsSwiping(false)
      const postElement = e.event.target?.closest(".post-item") as HTMLElement | null
      if (postElement) {
        const postWidth = postElement.offsetWidth
        if (Math.abs(e.deltaX) > postWidth * 0.33) {
          setDeletingId(postElement.id)
          setTimeout(() => {
            setPosts((prev) => prev.filter((post) => post.id !== postElement.id))
            setDeletingId(null)
          }, 300)
        } else {
          postElement.style.transform = ""
          postElement.style.opacity = "1"
        }
      }
    },
    trackMouse: true,
    delta: 5,
  })

  const handleCreatePost = useCallback(() => {
    if (!selectedMood || !newPostMessage.trim()) return

    const newPost: MoodPost = {
      id: uuidv4(),
      username: generateUsername(),
      mood: selectedMood,
      message: newPostMessage.trim(),
      timestamp: Date.now(),
      expiresAt: Date.now() + 86400000,
      replies: [],
      likes: 0,
    }

    setPosts((prev) => [newPost, ...prev])
    setNewPostMessage("")
    setSelectedMood(null)
    setShowCreateForm(false)
  }, [selectedMood, newPostMessage])

  const handleReply = useCallback(() => {
    if (!selectedPost || !replyMessage.trim()) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              replies: [
                ...(post.replies || []),
                {
                  id: uuidv4(),
                  username: generateUsername(),
                  message: replyMessage.trim(),
                  timestamp: Date.now(),
                  likes: 0,
                },
              ],
            }
          : post,
      ),
    )
    setReplyMessage("")
    setSelectedPost(null)
  }, [replyMessage, selectedPost])

  const handleLikePost = useCallback(() => {
    if (!selectedPost) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )

    setSelectedPost((prev) =>
      prev
        ? {
            ...prev,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            isLiked: !prev.isLiked,
          }
        : null,
    )
  }, [selectedPost])

  const handleSavePost = useCallback(() => {
    if (!selectedPost) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              isSaved: !post.isSaved,
            }
          : post,
      ),
    )

    setSelectedPost((prev) =>
      prev
        ? {
            ...prev,
            isSaved: !prev.isSaved,
          }
        : null,
    )
  }, [selectedPost])

  if (!hasMounted) {
    return null
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900"
      }`}
    >
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeOut">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-24 h-24">
              {Object.values(moodIcons).map((Icon, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 m-auto text-3xl transition-opacity duration-500 ${
                    index === currentMood ? "opacity-100" : "opacity-0"
                  } ${Object.values(moodColors)[index]}`}
                >
                  <Icon />
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              MoodSphere
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} font-medium max-w-xs px-4`}>
              {loadingTips[currentTip]}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`p-4 backdrop-blur-lg border-b transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900/95 border-gray-800 text-white" : "bg-white/95 border-gray-200"
        } sticky top-0 z-30`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              MoodSphere
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-all`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <FaSun className="text-xl text-amber-400" /> : <FaMoon className="text-xl text-gray-600" />}
            </button>

            <button
              onClick={() => setShowCreateForm(true)}
              className={`p-2.5 rounded-xl ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-200"
              } border transition-all`}
              aria-label="Create new post"
            >
              <FaPlusCircle className={`${isDarkMode ? "text-white" : "text-gray-700"} text-xl`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        {/* Create Post View */}
        {showCreateForm && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } backdrop-blur-lg rounded-2xl border p-6 animate-fadeIn shadow-lg mb-6`}
          >
            <div className="mb-8">
              <h2 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-xl font-bold mb-6`}>
                Share Your Mood
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {Object.entries(moodIcons).map(([mood, Icon]) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood as MoodType)}
                    className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                      selectedMood === mood
                        ? `${moodBgColors[mood as MoodType]} text-white shadow-lg`
                        : `${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${
                            moodColors[mood as MoodType]
                          }`
                    }`}
                  >
                    <Icon className="text-2xl mb-1.5" />
                    <span className="text-xs font-semibold capitalize">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <textarea
                value={newPostMessage}
                onChange={(e) => setNewPostMessage(e.target.value)}
                placeholder="What's on your mind today?"
                className={`${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 placeholder:text-gray-400"
                    : "bg-white border-gray-200 placeholder:text-gray-500"
                } w-full p-4 rounded-xl border focus:border-purple-300 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none`}
                rows={4}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className={`px-5 py-3.5 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } font-semibold rounded-xl transition-all flex-1`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!selectedMood || !newPostMessage.trim() || newPostMessage.length > 300}
                  className="px-5 py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 flex-1"
                >
                  Share Mood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed View */}
        <div className="space-y-4" {...handlers}>
          {posts.length === 0 ? (
            <div
              className={`p-8 text-center rounded-2xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } backdrop-blur-lg border animate-fadeIn shadow-lg`}
            >
              <FaMagic className="text-4xl mb-3 mx-auto text-purple-500" />
              <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-lg font-medium`}>
                Be the first to share your mood!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
              >
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => {
              const Icon = moodIcons[post.mood]
              const colorClass = moodColors[post.mood]
              const bgColorClass = moodBgColors[post.mood]

              return (
                <div
                  key={post.id}
                  id={post.id}
                  className={`post-item relative ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  } backdrop-blur-lg rounded-2xl border overflow-hidden transition-transform ${
                    deletingId === post.id ? "animate-slideOut" : ""
                  } shadow-md`}
                  onClick={() => !isSwiping && setSelectedPost(post)}
                >
                  <div className="p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-2.5 rounded-xl ${bgColorClass} bg-opacity-20 border border-opacity-30 ${bgColorClass.replace(
                          "bg-",
                          "border-",
                        )}`}
                      >
                        <Icon className={`text-xl ${colorClass}`} />
                      </div>
                      <div>
                        <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-base font-semibold`}>
                          {post.username}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(post.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <p className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} text-base mb-4 pl-2`}>
                      {post.message}
                    </p>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setPosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id
                                ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
                                : p,
                            ),
                          )
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                          post.isLiked
                            ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-colors`}
                      >
                        <FaHeart className={post.isLiked ? "text-red-500" : "text-gray-400"} />
                        <span>{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaReply className="text-gray-400" />
                        <span>{post.replies?.length || 0}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, isSaved: !p.isSaved } : p)))
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                          post.isSaved
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-colors ml-auto`}
                      >
                        <FaBookmark className={post.isSaved ? "text-blue-500" : "text-gray-400"} />
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaShare className="text-gray-400" />
                      </button>
                    </div>

                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {post.replies.slice(0, 1).map((reply) => (
                          <div key={reply.id} className="ml-4 pl-3 border-l-2 border-purple-200/60 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-600"}`}>
                                {reply.username}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(reply.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                              {reply.message}
                            </p>
                          </div>
                        ))}

                        {post.replies.length > 1 && (
                          <div className="mt-2 text-purple-500 text-sm font-medium">
                            + {post.replies.length - 1} more {post.replies.length === 2 ? "reply" : "replies"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Post Modal */}
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onReply={handleReply}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            isDarkMode={isDarkMode}
            onLike={handleLikePost}
            onSave={handleSavePost}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200"
        } border-t backdrop-blur-lg z-30`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
                } text-white transition-colors`}
              >
                <FaPlusCircle />
                <span>New Post</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 1s ease-out forwards;
          animation-delay: 1.5s;
        }
        
        .animate-slideOut {
          animation: slideOut 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
