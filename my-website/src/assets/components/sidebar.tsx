import { useState } from "react";
import { Search, Menu, BarChart3, Filter, Settings, Calendar, ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useResponsive } from "./ui/use-responsive";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onSearch: (query: string) => void;
}

const navigationItems = [
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'menu', icon: Menu, label: 'Menu' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'filter', icon: Filter, label: 'Filter' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'more', icon: ArrowRight, label: 'More' },
];

export function Sidebar({ activeView, onViewChange, onSearch }: SidebarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile } = useResponsive();

  // Hide sidebar on mobile - it will be replaced by mobile navigation
  if (isMobile) {
    return null;
  }

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
    onSearch("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative">
      <div className="w-20 bg-sidebar min-h-screen flex flex-col items-center py-6 space-y-6">
        {navigationItems.map((item) => {
          if (item.id === 'search') {
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="w-12 h-12 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-xl"
                onClick={handleSearchClick}
              >
                <item.icon className="h-6 w-6" />
              </Button>
            );
          }
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 p-0 rounded-xl transition-colors ${
                activeView === item.id 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-6 w-6" />
            </Button>
          );
        })}
      </div>

      <AnimatePresence>
        {isSearchExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-20 h-full bg-white shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-800">Search Meals</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSearchClose}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Search for meals, recipes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full"
                  autoFocus
                />
              </form>
              
              {searchQuery && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Searching for: "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}