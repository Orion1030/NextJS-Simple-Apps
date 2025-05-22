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
  FaStream,
  FaReply,
  FaTimes,
  FaMagic,
  FaSun,
  FaMoon,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaHeart,
  FaShare,
  FaBookmark,
  FaPhone,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaUserAlt,
  FaRegLightbulb,
  FaRegCommentDots,
  FaRegClock,
} from "react-icons/fa"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { ReactNode } from "react"

// Fix Leaflet icon issue
interface ExtendedIconDefault extends L.Icon.Default {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as ExtendedIconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Types
type MoodType = "happy" | "sad" | "angry" | "anxious" | "relaxed" | "excited" | "grateful"
type ViewType = "feed" | "create" | "map" | "challenges" | "resources" | "profile"

interface MoodPost {
  id: string
  username: string
  mood: MoodType
  message: string
  timestamp: number
  expiresAt: number
  location?: {
    lat: number
    lng: number
    city?: string
    country?: string
  }
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

interface Challenge {
  id: string
  title: string
  description: string
  icon: ReactNode
  duration: string
  participants: number
  isActive: boolean
}

interface Resource {
  id: string
  title: string
  description: string
  link: string
  category: "crisis" | "therapy" | "meditation" | "community"
  icon: ReactNode
}

// Constants
const loadingTips = [
  "Tip: Keep your messages concise and authentic",
  "Did you know? Sharing moods helps build empathy",
  "Remember: All posts disappear after 24 hours",
  "Pro tip: Swipe left on posts to dismiss them",
  "Fun fact: Your username is randomly generated",
  "Challenge yourself with our weekly mood activities",
  "Explore the Mood Map to see how others feel globally",
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
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(100 + Math.random() * 900)}`
}

const generateRandomLocation = () => {
  // Generate more realistic coordinates
  // Sydney: -33.8688, 151.2093
  // New York: 40.7128, -74.0060
  // London: 51.5074, -0.1278
  // Tokyo: 35.6762, 139.6503
  // Berlin: 52.5200, 13.4050
  // Paris: 48.8566, 2.3522
  // Toronto: 43.6532, -79.3832

  const cities = [
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "New York", lat: 40.7128, lng: -74.006 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Berlin", lat: 52.52, lng: 13.405 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  ]

  const randomCity = cities[Math.floor(Math.random() * cities.length)]

  // Add a small random offset to prevent markers from stacking exactly
  const latOffset = (Math.random() - 0.5) * 0.1
  const lngOffset = (Math.random() - 0.5) * 0.1

  return {
    lat: randomCity.lat + latOffset,
    lng: randomCity.lng + lngOffset,
    city: randomCity.name,
  }
}

const generateMockChallenges = (): Challenge[] => [
  {
    id: "1",
    title: "Gratitude Journal",
    description: "Write down three things you're grateful for each day this week.",
    icon: <FaRegLightbulb className="text-yellow-500" />,
    duration: "7 days",
    participants: 1243,
    isActive: true,
  },
  {
    id: "2",
    title: "Mood Reflection",
    description: "Take a moment each evening to reflect on your emotional journey throughout the day.",
    icon: <FaRegCommentDots className="text-blue-500" />,
    duration: "5 days",
    participants: 876,
    isActive: true,
  },
  {
    id: "3",
    title: "Random Acts of Kindness",
    description: "Perform one small act of kindness each day and notice how it affects your mood.",
    icon: <FaHeart className="text-red-500" />,
    duration: "3 days",
    participants: 2105,
    isActive: false,
  },
  {
    id: "4",
    title: "Digital Detox",
    description: "Reduce screen time by 50% and observe changes in your emotional wellbeing.",
    icon: <FaRegClock className="text-green-500" />,
    duration: "Weekend",
    participants: 543,
    isActive: false,
  },
]

const generateMockResources = (): Resource[] => [
  {
    id: "1",
    title: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a Crisis Counselor",
    link: "https://www.crisistextline.org/",
    category: "crisis",
    icon: <FaPhone className="text-red-500" />,
  },
  {
    id: "2",
    title: "BetterHelp Online Therapy",
    description: "Professional therapy accessible online",
    link: "https://www.betterhelp.com/",
    category: "therapy",
    icon: <FaRegCommentDots className="text-blue-500" />,
  },
  {
    id: "3",
    title: "Headspace",
    description: "Meditation and mindfulness techniques",
    link: "https://www.headspace.com/",
    category: "meditation",
    icon: <FaRegLightbulb className="text-orange-500" />,
  },
  {
    id: "4",
    title: "7 Cups",
    description: "Online emotional support community",
    link: "https://www.7cups.com/",
    category: "community",
    icon: <FaHeart className="text-pink-500" />,
  },
]

// Components
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
      className={`fixed inset-0 ${isDarkMode ? "bg-black/70" : "bg-black/30"} backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn z-50`}
    >
      <div
        ref={modalRef}
        className={`${isDarkMode ? "bg-gray-800/90 text-white border-gray-700" : "bg-white/90 text-gray-800 border-gray-200"} rounded-2xl backdrop-blur-lg border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl`}
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
                className={`p-3 rounded-xl ${bgColorClass} bg-opacity-20 border border-opacity-30 ${bgColorClass.replace("bg-", "border-")}`}
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
              {post.location && (
                <div className="ml-auto flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{post.location.city || "Unknown location"}</span>
                </div>
              )}
            </div>
            <p className={`${isDarkMode ? "text-white" : "text-gray-700"} text-base leading-relaxed`}>{post.message}</p>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${post.isLiked ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-colors`}
              >
                <FaHeart className={post.isLiked ? "text-red-500" : "text-gray-400"} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={onSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${post.isSaved ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500" : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-colors`}
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
                className={`${isDarkMode ? "bg-gray-700 border-gray-600 placeholder:text-gray-400" : "bg-white border-gray-200 placeholder:text-gray-500"} w-full p-4 rounded-xl border focus:border-purple-300 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none`}
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

const MoodMap = ({ posts, isDarkMode }: { posts: MoodPost[]; isDarkMode: boolean }) => {
  // Filter posts with location data and log them for debugging
  const postsWithLocation = posts.filter((post) => post.location)
  console.log("Posts with location data:", postsWithLocation)

  return (
    <div className="h-[70vh] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            isDarkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        {postsWithLocation.map((post) => {
          const Icon = moodIcons[post.mood]
          const colorClass = moodColors[post.mood]
          const bgColorClass = moodBgColors[post.mood]

          // Log each marker being created
          console.log("Creating marker for:", post.location)

          return (
            <Marker
              key={post.id}
              position={[post.location!.lat, post.location!.lng]}
              icon={L.divIcon({
                className: "custom-div-icon",
                html: `<div class="marker-pin ${post.mood}"><div class="marker-icon"></div></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              })}
            >
              <Popup>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`${colorClass}`} />
                    <span className="font-semibold">{post.username}</span>
                  </div>
                  <p className="text-sm mb-2">{post.message}</p>
                  <div className="text-xs text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {post.location!.city || "Unknown location"}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style jsx global>{`
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          border: 2px solid white;
        }
        .marker-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: white;
        }
        .marker-pin.happy { background-color: rgba(234, 179, 8, 0.9); }
        .marker-pin.sad { background-color: rgba(59, 130, 246, 0.9); }
        .marker-pin.angry { background-color: rgba(239, 68, 68, 0.9); }
        .marker-pin.anxious { background-color: rgba(249, 115, 22, 0.9); }
        .marker-pin.relaxed { background-color: rgba(34, 197, 94, 0.9); }
        .marker-pin.excited { background-color: rgba(168, 85, 247, 0.9); }
        .marker-pin.grateful { background-color: rgba(236, 72, 153, 0.9); }
      `}</style>
    </div>
  )
}

const ChallengeCard = ({
  challenge,
  isDarkMode,
  onJoin,
}: {
  challenge: Challenge
  isDarkMode: boolean
  onJoin: () => void
}) => {
  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl border p-5 transition-all hover:shadow-md`}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} mr-4`}>{challenge.icon}</div>
        <div className="flex-1">
          <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} font-semibold text-lg mb-1`}>
            {challenge.title}
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm mb-3`}>{challenge.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs flex items-center`}>
                <FaRegClock className="mr-1" /> {challenge.duration}
              </span>
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs flex items-center`}>
                <FaUserAlt className="mr-1" /> {challenge.participants.toLocaleString()}
              </span>
            </div>
            <button
              onClick={onJoin}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                challenge.isActive
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {challenge.isActive ? "Joined" : "Join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ResourceCard = ({ resource, isDarkMode }: { resource: Resource; isDarkMode: boolean }) => {
  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-750" : "bg-white border-gray-200 hover:bg-gray-50"} rounded-xl border p-5 transition-all hover:shadow-md block`}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} mr-4`}>{resource.icon}</div>
        <div>
          <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} font-semibold text-lg mb-1`}>
            {resource.title}
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>{resource.description}</p>

          <div className="flex items-center mt-3">
            <span
              className={`${
                resource.category === "crisis"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : resource.category === "therapy"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : resource.category === "meditation"
                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
              } px-2 py-0.5 rounded text-xs font-medium`}
            >
              {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

const NavBar = ({
  view,
  setView,
  isDarkMode,
  setIsDarkMode,
}: {
  view: ViewType
  setView: (view: ViewType) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}) => {
  return (
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
            onClick={() => setView("create")}
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

      <nav className={`max-w-4xl mx-auto mt-4 flex items-center justify-between overflow-x-auto hide-scrollbar`}>
        <button
          onClick={() => setView("feed")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            view === "feed"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-900"
              : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaStream /> <span>Feed</span>
        </button>

        <button
          onClick={() => setView("map")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            view === "map"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-900"
              : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaGlobeAmericas /> <span>Mood Map</span>
        </button>

        <button
          onClick={() => setView("challenges")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            view === "challenges"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-900"
              : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaCalendarAlt /> <span>Challenges</span>
        </button>

        <button
          onClick={() => setView("resources")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            view === "resources"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-900"
              : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaInfoCircle /> <span>Resources</span>
        </button>
      </nav>
    </header>
  )
}

// Main Component
const Home = () => {
  const [view, setView] = useState<ViewType>("feed")
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
  const [challenges, setChallenges] = useState<Challenge[]>(generateMockChallenges())
  const [resources] = useState<Resource[]>(generateMockResources())
  const [shareLocation, setShareLocation] = useState(false)

  // Load posts from localStorage and clean up expired posts
  useEffect(() => {
    const savedPosts = localStorage.getItem("moodPosts")
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts)
      // Filter out expired posts
      const validPosts = parsedPosts.filter((post: MoodPost) => post.expiresAt > Date.now())
      setPosts(validPosts)
    } else {
      // Generate some mock posts if none exist
      const mockPosts = Array.from({ length: 5 }, (_, i) => {
        const mood = Object.keys(moodIcons)[Math.floor(Math.random() * Object.keys(moodIcons).length)] as MoodType
        const location = generateRandomLocation()
        const cityNames = ["New York", "Tokyo", "London", "Sydney", "Berlin", "Paris", "Toronto"]
        const cityName = cityNames[i % 7]

        // Find the corresponding coordinates for this city
        const cityCoords = {
          "New York": { lat: 40.7128, lng: -74.006 },
          Tokyo: { lat: 35.6762, lng: 139.6503 },
          London: { lat: 51.5074, lng: -0.1278 },
          Sydney: { lat: -33.8688, lng: 151.2093 },
          Berlin: { lat: 52.52, lng: 13.405 },
          Paris: { lat: 48.8566, lng: 2.3522 },
          Toronto: { lat: 43.6532, lng: -79.3832 },
        }[cityName]

        // Add a small random offset
        const latOffset = (Math.random() - 0.5) * 0.1
        const lngOffset = (Math.random() - 0.5) * 0.1

        return {
          id: uuidv4(),
          username: generateUsername(),
          mood,
          message: [
            "Feeling absolutely fantastic today! The sun is shining and everything seems possible.",
            "Had a rough day at work. Could use some encouragement.",
            "So frustrated with public transportation today. Deep breaths...",
            "Nervous about my presentation tomorrow. Any tips for calming anxiety?",
            "Just finished a meditation session and feeling centered.",
            "Excited about my upcoming trip! Can't wait to explore new places!",
            "Grateful for the small moments of joy in my day today.",
          ][i % 7],
          timestamp: Date.now() - Math.floor(Math.random() * 86400000),
          expiresAt: Date.now() + 86400000,
          location: {
            lat: cityCoords.lat + latOffset,
            lng: cityCoords.lng + lngOffset,
            city: cityName,
          },
          replies:
            i % 3 === 0
              ? [
                  {
                    id: uuidv4(),
                    username: generateUsername(),
                    message: "I completely understand how you feel. Hang in there!",
                    timestamp: Date.now() - Math.floor(Math.random() * 3600000),
                    likes: Math.floor(Math.random() * 10),
                  },
                ]
              : [],
          likes: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.7,
          isSaved: Math.random() > 0.8,
        }
      })
      setPosts(mockPosts)
    }

    // Check for dark mode preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("moodSphereTheme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(prefersDark)
    }

    // Loading animation
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
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("moodPosts", JSON.stringify(posts))
    }
  }, [posts])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("moodSphereTheme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  // Swipe handlers for post dismissal
  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true)
      const postElement = e.event.target?.closest(".post-item")
      if (postElement) {
        const postWidth = postElement.offsetWidth
        const delta = Math.min(e.deltaX, 0)
        const translateX = Math.max(delta, -postWidth * 0.33)
        postElement.style.transform = `translateX(${translateX}px)`

        // Add opacity effect based on swipe distance
        const opacity = 1 - Math.min(Math.abs(translateX) / (postWidth * 0.33), 0.5)
        postElement.style.opacity = opacity.toString()
      }
    },
    onSwiped: (e) => {
      setIsSwiping(false)
      const postElement = e.event.target?.closest(".post-item")
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

  // Create a new post
  const handleCreatePost = useCallback(() => {
    if (!selectedMood || !newPostMessage.trim()) return

    let locationData = undefined

    if (shareLocation) {
      // In a real app, we would use the browser's geolocation API
      // For this demo, we'll generate a location based on predefined cities
      const cities = [
        { name: "Sydney", lat: -33.8688, lng: 151.2093 },
        { name: "New York", lat: 40.7128, lng: -74.006 },
        { name: "London", lat: 51.5074, lng: -0.1278 },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
        { name: "Berlin", lat: 52.52, lng: 13.405 },
        { name: "Paris", lat: 48.8566, lng: 2.3522 },
        { name: "Toronto", lat: 43.6532, lng: -79.3832 },
      ]

      const randomCity = cities[Math.floor(Math.random() * cities.length)]
      const latOffset = (Math.random() - 0.5) * 0.1
      const lngOffset = (Math.random() - 0.5) * 0.1

      locationData = {
        lat: randomCity.lat + latOffset,
        lng: randomCity.lng + lngOffset,
        city: randomCity.name,
      }
    }

    const newPost: MoodPost = {
      id: uuidv4(),
      username: generateUsername(),
      mood: selectedMood,
      message: newPostMessage.trim(),
      timestamp: Date.now(),
      expiresAt: Date.now() + 86400000, // 24 hours
      location: locationData,
      replies: [],
      likes: 0,
    }

    setPosts((prev) => [newPost, ...prev])
    setNewPostMessage("")
    setSelectedMood(null)
    setShareLocation(false)
    setView("feed")
  }, [selectedMood, newPostMessage, shareLocation])

  // Reply to a post
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

  // Like a post
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

  // Save a post
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

  // Join a challenge
  const handleJoinChallenge = useCallback(
    (challengeId: string) => {
      // Update the challenges state directly
      const updatedChallenges = challenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, isActive: !challenge.isActive } : challenge,
      )

      // In a real app, we would persist this to a database
      // For this demo, we'll update the local state
      setChallenges(updatedChallenges)
    },
    [challenges],
  )

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
                <Icon
                  key={index}
                  className={`absolute inset-0 m-auto text-5xl transition-opacity duration-500 ${
                    index === currentMood ? "opacity-100" : "opacity-0"
                  } ${Object.values(moodColors)[index]}`}
                />
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

      {/* Navigation */}
      <NavBar view={view} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        {/* Create Post View */}
        {view === "create" && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } backdrop-blur-lg rounded-2xl border p-6 animate-fadeIn shadow-lg`}
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
                        : `${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${moodColors[mood as MoodType]}`
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

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareLocation}
                    onChange={() => setShareLocation(!shareLocation)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 ${
                      shareLocation ? "bg-purple-500" : isDarkMode ? "bg-gray-600" : "bg-gray-300"
                    } rounded-full p-1 transition-colors duration-300 ease-in-out`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        shareLocation ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span className={`ml-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Share location
                  </span>
                </label>

                <div className="ml-auto text-sm text-gray-500">
                  <span className={`${newPostMessage.length > 280 ? "text-red-500" : ""}`}>
                    {newPostMessage.length}
                  </span>
                  /300
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("feed")}
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
        {view === "feed" && (
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
                  onClick={() => setView("create")}
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
                          className={`p-2.5 rounded-xl ${bgColorClass} bg-opacity-20 border border-opacity-30 ${bgColorClass.replace("bg-", "border-")}`}
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
                        {post.location && (
                          <div className="ml-auto flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{post.location.city || "Unknown location"}</span>
                          </div>
                        )}
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
        )}

        {/* Map View */}
        {view === "map" && (
          <div className="space-y-6 animate-fadeIn">
            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } border shadow-md`}
            >
              <h2 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-xl font-bold mb-2`}>
                Global Mood Map
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm mb-4`}>
                Explore how people are feeling around the world. Each marker represents a mood post.
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                {Object.entries(moodIcons).map(([mood, Icon]) => (
                  <div key={mood} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${moodBgColors[mood as MoodType]}`}></div>
                    <span
                      className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"} capitalize`}
                    >
                      {mood}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <MoodMap posts={posts} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Challenges View */}
        {view === "challenges" && (
          <div className="space-y-6 animate-fadeIn">
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } border shadow-md`}
            >
              <h2 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-xl font-bold mb-2`}>
                Mood Challenges
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Join these activities to improve your emotional wellbeing and connect with others.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isDarkMode={isDarkMode}
                  onJoin={() => handleJoinChallenge(challenge.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Resources View */}
        {view === "resources" && (
          <div className="space-y-6 animate-fadeIn">
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } border shadow-md`}
            >
              <h2 className={`${isDarkMode ? "text-white" : "text-gray-800"} text-xl font-bold mb-2`}>
                Mental Health Resources
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Access professional support and tools for your emotional wellbeing.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} isDarkMode={isDarkMode} />
              ))}
            </div>

            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-red-900/30 border-red-800/50 text-white" : "bg-red-50 border-red-100 text-red-800"
              } border`}
            >
              <div className="flex items-start">
                <FaInfoCircle className="text-lg mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold mb-1">Emergency Help</h3>
                  <p className="text-sm">
                    If you're experiencing a mental health emergency, please call your local emergency services (911 in
                    the US) or a crisis hotline immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

      {/* Mobile Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200"
        } border-t backdrop-blur-lg z-30 md:hidden`}
      >
        <div className="flex items-center justify-around">
          <button
            onClick={() => setView("feed")}
            className={`p-4 flex flex-col items-center gap-1 ${
              view === "feed"
                ? isDarkMode
                  ? "text-purple-400"
                  : "text-purple-600"
                : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
          >
            <FaStream />
            <span className="text-xs">Feed</span>
          </button>

          <button
            onClick={() => setView("map")}
            className={`p-4 flex flex-col items-center gap-1 ${
              view === "map"
                ? isDarkMode
                  ? "text-purple-400"
                  : "text-purple-600"
                : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
          >
            <FaGlobeAmericas />
            <span className="text-xs">Map</span>
          </button>

          <button
            onClick={() => setView("create")}
            className={`p-2 -mt-5 rounded-full ${isDarkMode ? "bg-purple-500" : "bg-purple-600"} text-white`}
          >
            <FaPlusCircle className="text-2xl" />
          </button>

          <button
            onClick={() => setView("challenges")}
            className={`p-4 flex flex-col items-center gap-1 ${
              view === "challenges"
                ? isDarkMode
                  ? "text-purple-400"
                  : "text-purple-600"
                : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
          >
            <FaCalendarAlt />
            <span className="text-xs">Challenges</span>
          </button>

          <button
            onClick={() => setView("resources")}
            className={`p-4 flex flex-col items-center gap-1 ${
              view === "resources"
                ? isDarkMode
                  ? "text-purple-400"
                  : "text-purple-600"
                : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
          >
            <FaInfoCircle />
            <span className="text-xs">Resources</span>
          </button>
        </div>
      </nav>

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
        
        /* Leaflet custom styles */
        .leaflet-container {
          font: inherit;
          border-radius: 0.75rem;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
        }
        
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default Home
