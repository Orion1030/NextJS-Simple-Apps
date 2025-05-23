"use client"

import { useState, useEffect } from "react"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

interface Feeling {
  id: number
  title: string
  description: string
  category: "happy" | "sad" | "angry" | "inspired" | "grateful" | "curious"
  date: string
  userId: number
}

interface User {
  id: number
  name: string
  avatar: string
  bio: string
}

const ClientDate = ({ dateString }: { dateString: string }) => {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString())
  }, [dateString])

  return <span>{formattedDate}</span>
}

const FeelingCard = ({ feeling, user }: { feeling: Feeling; user: User }) => {
  const categoryColors = {
    happy: "bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200",
    sad: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200",
    angry: "bg-gradient-to-br from-red-50 to-red-100 border border-red-200",
    inspired: "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200",
    grateful: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200",
    curious: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200",
  }

  const textColors = {
    happy: "text-yellow-800",
    sad: "text-blue-800",
    angry: "text-red-800",
    inspired: "text-purple-800",
    grateful: "text-green-800",
    curious: "text-orange-800",
  }

  const accentColors = {
    happy: "bg-yellow-500",
    sad: "bg-blue-500",
    angry: "bg-red-500",
    inspired: "bg-purple-500",
    grateful: "bg-green-500",
    curious: "bg-orange-500",
  }

  return (
    <div
      className={`backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 rounded-2xl p-6 shadow-lg border ${
        categoryColors[feeling.category]
      } transition-all duration-300 hover:shadow-xl`}
    >
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <ClientDate dateString={feeling.date} />
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{feeling.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FeelingsJournal = () => {
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredFeelings, setFilteredFeelings] = useState<Feeling[]>([])
  const [newFeeling, setNewFeeling] = useState({
    title: "",
    description: "",
    category: "happy",
  })
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"all" | "user">("all")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

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
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const feelingsData = [
        {
          id: 1,
          title: "Today was amazing!",
          description: "I had a great day at work and spent time with friends in the evening.",
          category: "happy",
          date: new Date().toISOString(),
          userId: 1,
        },
        {
          id: 2,
          title: "Feeling a bit down",
          description: "Missed my family today. Wishing I could see them soon.",
          category: "sad",
          date: new Date().toISOString(),
          userId: 2,
        },
        {
          id: 3,
          title: "Inspired by nature",
          description: "Went for a hike today and felt so connected to the world around me.",
          category: "inspired",
          date: new Date().toISOString(),
          userId: 1,
        },
        {
          id: 4,
          title: "Grateful for my health",
          description: "Had a check-up today and everything is great. Feeling blessed.",
          category: "grateful",
          date: new Date().toISOString(),
          userId: 3,
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

      setFeelings(feelingsData)
      setUsers(usersData)
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

    if (viewMode === "user" && selectedUser !== null) {
      result = result.filter((feeling) => feeling.userId === selectedUser)
    }

    setFilteredFeelings(result)
  }, [selectedCategories, viewMode, selectedUser, feelings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFeeling.title.trim() || !newFeeling.description.trim()) return

    const feelingToAdd: Feeling = {
      id: feelings.length + 1,
      title: newFeeling.title,
      description: newFeeling.description,
      category: newFeeling.category,
      date: new Date().toISOString(),
      userId: selectedUser || 1,
    }

    setFeelings([feelingToAdd, ...feelings])
    setNewFeeling({ title: "", description: "", category: "happy" })
  }

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId === selectedUser ? null : userId)
    setViewMode("user")
  }

  const handleViewModeChange = (mode: "all" | "user") => {
    setViewMode(mode)
    if (mode === "all") {
      setSelectedUser(null)
    }
  }

  const handleCreateUser = (newUser: User) => {
    setUsers([...users, newUser])
  }

  const UserAvatar = ({ user, isSelected }: { user: User; isSelected: boolean }) => {
    return (
      <div className="relative group">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
          alt={user.name}
          className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-300 ${
            isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50"
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            const fallbackUrl = `https://placehold.co/48x48?text=${user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}`
            target.src = fallbackUrl
          }}
        />
        {isSelected && (
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full text-xs">
            ✓
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 pb-2">
                Feelings Journal
              </h1>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Share and connect with others through emotions
              </p>
            </div>
          </div>

          {isClient && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewModeChange("all")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "all"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-800"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  All Feelings
                </button>
                <button
                  onClick={() => handleViewModeChange("user")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "user"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-800"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  My Feelings
                </button>
              </div>

              {viewMode === "user" && (
                <div className="flex items-center gap-2">
                  <UserAvatar user={users.find((u) => u.id === selectedUser) as User} isSelected={true} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Viewing your posts
                  </span>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Change user
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search feelings..."
                className="w-full p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-100 dark:border-purple-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-100 dark:border-purple-900 text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              >
                {showFilters ? "Hide Filters" : "Filters"}
              </button>
              <button
                onClick={() => (document.getElementById("add-feeling-modal") as HTMLDialogElement).showModal()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-800"
              >
                Add Feeling
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => toggleCategory(category.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                      selectedCategories.includes(category.value)
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-800"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Feelings</h2>
            {viewMode === "all" && (
              <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a user to view their journal</h3>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedUser === user.id ? "scale-105" : "hover:scale-105"
                      }`}
                    >
                      <UserAvatar user={user} isSelected={selectedUser === user.id} />
                    </div>
                  ))}
                  <div
                    onClick={() =>
                      (document.getElementById("create-user-modal") as HTMLDialogElement).showModal()
                    }
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-200 dark:shadow-purple-800"
                  >
                    <span className="text-xl">+</span>
                  </div>
                </div>
              </div>
            )}
            {viewMode === "user" && selectedUser && (
              <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Profile</h3>
                <div className="flex items-center gap-3">
                  <UserAvatar user={users.find((u) => u.id === selectedUser) as User} isSelected={true} />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {users.find((u) => u.id === selectedUser)?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {users.find((u) => u.id === selectedUser)?.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 animate-pulse"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFeelings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFeelings.map((feeling) => {
                  const user = users.find((u) => u.id === feeling.userId)
                  return <FeelingCard key={feeling.id} feeling={feeling} user={user!} />
                })}
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 text-center">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No feelings found
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or add a new feeling
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <dialog id="add-feeling-modal" className="modal backdrop-blur-sm bg-black/50">
        <div className="modal-box bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-900">
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Add New Feeling</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newFeeling.title}
                  onChange={(e) => setNewFeeling({ ...newFeeling, title: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-purple-100 dark:border-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newFeeling.description}
                  onChange={(e) => setNewFeeling({ ...newFeeling, description: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-purple-100 dark:border-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 dark:text-gray-200"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newFeeling.category}
                  onChange={(e) => setNewFeeling({ ...newFeeling, category: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-purple-100 dark:border-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 dark:text-gray-200"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => (document.getElementById("add-feeling-modal") as HTMLDialogElement).close()}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-800"
              >
                Add Feeling
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog id="create-user-modal" className="modal backdrop-blur-sm bg-black/50">
        <div className="modal-box bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-900">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const newUser: User = {
                id: users.length + 1,
                name: form.name.value,
                avatar: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`,
                bio: form.bio.value,
              }
              handleCreateUser(newUser)
              setSelectedUser(newUser.id)
              setViewMode("user")
              ;(document.getElementById("create-user-modal") as HTMLDialogElement).close()
            }}
          >
            <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Create User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-purple-100 dark:border-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-purple-100 dark:border-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 dark:text-gray-200"
                  rows={2}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => (document.getElementById("create-user-modal") as HTMLDialogElement).close()}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-800"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default FeelingsJournal
// Zod Schema
export const Schema = {
    "commentary": "I will create a React component for a Feelings Journal app that allows users to share their emotions and connect with others. The app will have a slick design, work smoothly on both phones and computers, and include both light and dark modes. I will use Next.js with TypeScript and Tailwind CSS for styling, ensuring an interactive and functional experience.",
    "template": "nextjs-developer",
    "title": "Feelings Journal",
    "description": "An interactive feelings journal app with light and dark modes.",
    "additional_dependencies": [],
    "has_additional_dependencies": false,
    "install_dependencies_command": "",
    "port": 3000,
    "file_path": "app/page.tsx",
    "code": "<see code above>"
}