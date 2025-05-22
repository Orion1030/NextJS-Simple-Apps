"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  Home,
  Moon,
  Sun,
  Thermometer,
  Zap,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";

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
];

const Card = React.memo(({ className = "", children, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors ${className}`}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.memo(({ className = "", children, ...props }: React.ComponentProps<'div'>) => (
  <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

const CardContent = React.memo(({ className = "", children, ...props }: React.ComponentProps<'div'>) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

const CardTitle = React.memo(({ className = "", children, ...props }: React.ComponentProps<'h3'>) => (
  <h3
    className={`text-lg font-semibold text-gray-800 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.memo(({ className = "", children, ...props }: React.ComponentProps<'p'>) => (
  <p
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

const Button = React.memo(({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}) => {
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-2 py-1 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };

  return (
    <button
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const Input = React.memo(({ className = "", ...props }: React.ComponentProps<'input'>) => (
  <input
    className={`w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 ${className}`}
    {...props}
  />
));
Input.displayName = 'Input';

const Badge = React.memo(({ className = "", children, ...props }: React.ComponentProps<'span'>) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ${className}`}
    {...props}
  >
    {children}
  </span>
));
Badge.displayName = 'Badge';

const Switch = React.memo(({ className = "", checked, onChange, ...props }: React.ComponentProps<'button'> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange?.(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center justify-center rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${checked
      ? "bg-blue-500 dark:bg-blue-600"
      : "bg-gray-200 dark:bg-gray-700"
      } ${className}`}
    {...props}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"
        }`}
    />
  </button>
));
Switch.displayName = 'Switch';

const ScrollArea = React.memo(({ className = "", children, ...props }: React.ComponentProps<'div'>) => (
  <div className={`overflow-auto ${className}`} {...props}>
    {children}
  </div>
));
ScrollArea.displayName = 'ScrollArea';

const HomeAssistant = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [livingRoomTemp, setLivingRoomTemp] = useState(72);
  const [bedroomTemp, setBedroomTemp] = useState(68);
  const [kitchenLightOn, setKitchenLightOn] = useState(true);
  const [bedroomACOn, setBedroomACOn] = useState(false);
  const [devices, setDevices] = useState(smartHomeDevices);
  const [energyUsage, setEnergyUsage] = useState([
    { name: "Mon", value: 12 },
    { name: "Tue", value: 15 },
    { name: "Wed", value: 18 },
    { name: "Thu", value: 13 },
    { name: "Fri", value: 16 },
    { name: "Sat", value: 20 },
    { name: "Sun", value: 14 },
  ]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("Light");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showAllDevices, setShowAllDevices] = useState(false);
  const [tempValue, setTempValue] = useState(0);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleKitchenLight = () => {
    setKitchenLightOn(!kitchenLightOn);
  };

  const toggleBedroomAC = () => {
    setBedroomACOn(!bedroomACOn);
  };

  const adjustTemp = (room: "living" | "bedroom", direction: "up" | "down") => {
    if (room === "living") {
      setLivingRoomTemp(livingRoomTemp + (direction === "up" ? 1 : -1));
    } else {
      setBedroomTemp(bedroomTemp + (direction === "up" ? 1 : -1));
    }
  };

  const handleAddDevice = () => {
    if (newDeviceName.trim() !== "") {
      const newDevice = {
        id: devices.length + 1,
        name: newDeviceName,
        type: newDeviceType,
        icon: getDeviceIcon(newDeviceType),
      };
      setDevices([...devices, newDevice]);
      setNewDeviceName("");
      setNewDeviceType("Light");
      setShowDeviceModal(false);
      showToast(`Added new device: ${newDeviceName}`);
    }
  };

  const handleCancelAddDevice = () => {
    setNewDeviceName("");
    setNewDeviceType("Light");
    setShowDeviceModal(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Thermostat":
        return <Thermometer className="h-5 w-5" />;
      case "AC":
        return <Zap className="h-5 w-5" />;
      case "Sensor":
        return <Thermometer className="h-5 w-5" />;
      case "Door":
        return <Home className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedDevices = showAllDevices ? filteredDevices : filteredDevices.slice(0, 3);

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const containerClass = `min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans`;

  return (
    <div className={containerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Smart Home Dashboard
          </h1>
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
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
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
              <CardDescription>
                Manage your smart home devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-500 dark:text-blue-400">
                      <Home className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      Total Devices:
                    </span>
                  </div>
                  <Badge className="bg-blue-500 dark:bg-blue-600 text-white">
                    {devices.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Living Room
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustTemp("living", "up")}
                        className="h-8 w-8 p-0 rounded-full flex items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustTemp("living", "down")}
                        className="h-8 w-8 p-0 rounded-full flex items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                    {livingRoomTemp}°F
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Bedroom
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustTemp("bedroom", "up")}
                        className="h-8 w-8 p-0 rounded-full flex items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustTemp("bedroom", "down")}
                        className="h-8 w-8 p-0 rounded-full flex items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                    {bedroomTemp}°F
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full text-yellow-500 dark:text-yellow-400">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Kitchen Light
                      </span>
                    </div>
                    <Switch checked={kitchenLightOn} onChange={toggleKitchenLight} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-500 dark:text-indigo-400">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Bedroom AC
                      </span>
                    </div>
                    <Switch checked={bedroomACOn} onChange={toggleBedroomAC} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Energy Usage
              </CardTitle>
              <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={energyUsage}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
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
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {device.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {device.type}
                            </p>
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
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Add New Device
              </h2>
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
                    className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
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
    </div>
  );
};

export default HomeAssistant;
// Zod Schema
export const Schema = {
    "commentary": "I will create a Next.js 13+ app that has a simple UI to help users manage their smart home devices. This will include several components like a dashboard view, device list, and control interface. I will ensure the app is responsive and works on both phone and computer.",
    "template": "nextjs-developer",
    "title": "Smart Home",
    "description": "A simple smart home management app.",
    "additional_dependencies": [],
    "has_additional_dependencies": false,
    "install_dependencies_command": "",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}