"use client"
import React, { useState, useEffect } from "react"
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Bell, Home, Moon, Sun, Thermometer, Zap, Plus, X } from "lucide-react"

// Add modern font styles
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
  :root {
    --font-outfit: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  body {
    font-family: var(--font-outfit);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-outfit);
    font-weight: 600;
  }
`

const smartHomeDevices = [
  {
    id: 1,
    name: "Living Room Thermostat",
    type: "Thermostat",
    icon: <Thermometer className="h-5 w-5" />,
  },
  {
    id: 2,
    name: "Kitchen Light",
    type: "Light",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 3,
    name: "Bedroom AC",
    type: "AC",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 4,
    name: "Bathroom Humidity",
    type: "Sensor",
    icon: <Thermometer className="h-5 w-5" />,
  },
  {
    id: 5,
    name: "Garage Door",
    type: "Door",
    icon: <Home className="h-5 w-5" />,
  },
]

const Card = React.memo(({ className = "", children, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors ${className}`}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.memo(({ className = "", children, ...props }: React.ComponentProps<"div">) => (
  <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardContent = React.memo(({ className = "", children, ...props }: React.ComponentProps<"div">) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
))
CardContent.displayName = "CardContent"

const CardTitle = React.memo(({ className = "", children, ...props }: React.ComponentProps<"h3">) => (
  <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 ${className}`} {...props}>
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.memo(({ className = "", children, ...props }: React.ComponentProps<"p">) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`} {...props}>
    {children}
  </p>
))
CardDescription.displayName = "CardDescription"

const Button = React.memo(
  ({
    variant = "default",
    size = "default",
    className = "",
    children,
    ...props
  }: React.ComponentProps<"button"> & {
    variant?: "default" | "ghost" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
  }) => {
    const variantClasses = {
      default: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
      ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
      outline:
        "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
    }

    const sizeClasses = {
      default: "px-4 py-2 text-sm",
      sm: "px-2 py-1 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    }

    return (
      <button
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

const Input = React.memo(({ className = "", ...props }: React.ComponentProps<"input">) => (
  <input
    className={`w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 ${className}`}
    {...props}
  />
))
Input.displayName = "Input"

const Badge = React.memo(({ className = "", children, ...props }: React.ComponentProps<"span">) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ${className}`}
    {...props}
  >
    {children}
  </span>
))
Badge.displayName = "Badge"

const Switch = React.memo(
  ({
    className = "",
    checked,
    onChange,
    ...props
  }: React.ComponentProps<"button"> & {
    checked?: boolean
    onChange?: (checked: boolean) => void
  }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center justify-center rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        checked ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      } ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  ),
)
Switch.displayName = "Switch"

const Slider = React.memo(
  ({
    className = "",
    value,
    min = 60,
    max = 85,
    onChange,
    ...props
  }: React.ComponentProps<"input"> & {
    value: number
    min?: number
    max?: number
    onChange: (value: number) => void
  }) => (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-blue-600"
        {...props}
      />
    </div>
  ),
)
Slider.displayName = "Slider"

const ScrollArea = React.memo(({ className = "", children, ...props }: React.ComponentProps<"div">) => (
  <div className={`overflow-auto ${className}`} {...props}>
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

const HomeAssistant = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })
  const [livingRoomTemp, setLivingRoomTemp] = useState(72)
  const [bedroomTemp, setBedroomTemp] = useState(68)
  const [kitchenLightOn, setKitchenLightOn] = useState(true)
  const [bedroomACOn, setBedroomACOn] = useState(false)
  const [devices, setDevices] = useState(smartHomeDevices)
  const [energyUsage, setEnergyUsage] = useState([
    { name: "Mon", value: 12 },
    { name: "Tue", value: 15 },
    { name: "Wed", value: 18 },
    { name: "Thu", value: 13 },
    { name: "Fri", value: 16 },
    { name: "Sat", value: 20 },
    { name: "Sun", value: 14 },
  ])
  const [showDeviceModal, setShowDeviceModal] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("Light")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [showAllDevices, setShowAllDevices] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleKitchenLight = () => {
    setKitchenLightOn(!kitchenLightOn)
  }

  const toggleBedroomAC = () => {
    setBedroomACOn(!bedroomACOn)
  }

  const handleAddDevice = () => {
    if (newDeviceName.trim() !== "") {
      const newDevice = {
        id: devices.length + 1,
        name: newDeviceName,
        type: newDeviceType,
        icon: getDeviceIcon(newDeviceType),
      }
      setDevices([...devices, newDevice])
      setNewDeviceName("")
      setNewDeviceType("Light")
      setShowDeviceModal(false)
      showToast(`Added new device: ${newDeviceName}`)
    }
  }

  const handleCancelAddDevice = () => {
    setNewDeviceName("")
    setNewDeviceType("Light")
    setShowDeviceModal(false)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Thermostat":
        return <Thermometer className="h-5 w-5" />
      case "AC":
        return <Zap className="h-5 w-5" />
      case "Sensor":
        return <Thermometer className="h-5 w-5" />
      case "Door":
        return <Home className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const filteredDevices = devices.filter((device) => device.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const displayedDevices = showAllDevices ? filteredDevices : filteredDevices.slice(0, 3)

  const showToast = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
    // Apply dark mode immediately on load
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [isDarkMode])

  const containerClass = `min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-outfit antialiased text-gray-900 dark:text-gray-100`

  return (
    <div className={containerClass}>
      <style jsx global>
        {fontStyles}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Smart Home Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => showToast("Notifications will be implemented soon!")}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-4 py-3 rounded-md shadow-lg transition-all transform translate-y-0 opacity-100 z-50">
            <p className="text-sm font-medium">{notificationMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Overview</CardTitle>
              <CardDescription>Manage your smart home devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-500 dark:text-blue-400">
                      <Home className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Total Devices:</span>
                  </div>
                  <Badge className="bg-blue-500 dark:bg-blue-600 text-white">{devices.length}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Living Room</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-blue-500 dark:text-blue-400 min-w-[60px]">
                      {livingRoomTemp}°F
                    </div>
                    <Slider value={livingRoomTemp} onChange={setLivingRoomTemp} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Bedroom</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-blue-500 dark:text-blue-400 min-w-[60px]">
                      {bedroomTemp}°F
                    </div>
                    <Slider value={bedroomTemp} onChange={setBedroomTemp} className="flex-1" />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full text-yellow-500 dark:text-yellow-400">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">Kitchen Light</span>
                    </div>
                    <Switch checked={kitchenLightOn} onChange={toggleKitchenLight} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-500 dark:text-indigo-400">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">Bedroom AC</span>
                    </div>
                    <Switch checked={bedroomACOn} onChange={toggleBedroomAC} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
              <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyUsage} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}kW`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "0.5rem",
                        color: "#f9fafb",
                      }}
                      itemStyle={{ color: "#f9fafb" }}
                      labelStyle={{ color: "#d1d5db" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        strokeWidth: 0,
                        fill: "#3b82f6",
                      }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: "#3b82f6",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 dark:bg-blue-600 opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500 dark:bg-indigo-600 opacity-10 rounded-full -ml-20 -mb-20"></div>

            <CardHeader className="relative z-10">
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Add or modify your devices</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <ScrollArea className="h-[250px]">
                <div className="space-y-3 pr-4">
                  {displayedDevices.length > 0 ? (
                    displayedDevices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-500 dark:text-blue-400">
                            {device.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{device.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{device.type}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                        <X className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No devices found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowAllDevices(!showAllDevices)}
                  className="text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  {showAllDevices ? "Show Less" : "Show All"}
                </Button>
                <Button
                  onClick={() => setShowDeviceModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showDeviceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Device</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="device-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Device Name
                  </label>
                  <Input
                    id="device-name"
                    type="text"
                    placeholder="e.g., Backyard Camera"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="device-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Device Type
                  </label>
                  <select
                    id="device-type"
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 appearance-none"
                  >
                    <option>Light</option>
                    <option>Thermostat</option>
                    <option>AC</option>
                    <option>Sensor</option>
                    <option>Door</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelAddDevice}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDevice}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Add Device
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with modern styling */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                Smart Home Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control your home from anywhere</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <span className="sr-only">Support</span>
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <span className="sr-only">Settings</span>
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Smart Home Dashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeAssistant
// Zod Schema
export const Schema = {
  commentary:
    "I will create a Next.js 13+ app that has a simple UI to help users manage their smart home devices. This will include several components like a dashboard view, device list, and control interface. I will ensure the app is responsive and works on both phone and computer.",
  template: "nextjs-developer",
  title: "Smart Home",
  description: "A simple smart home management app.",
  additional_dependencies: [],
  has_additional_dependencies: false,
  install_dependencies_command: "",
  port: 3000,
  file_path: "pages/index.tsx",
  code: "<see code above>",
}
