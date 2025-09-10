import { Search, Menu, BarChart3, Filter, Settings, Calendar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface MobileNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'menu', icon: Menu, label: 'Menu' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'filter', icon: Filter, label: 'Filter' },
  { id: 'more', icon: ArrowRight, label: 'More' },
];

export function MobileNavigation({ activeView, onViewChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center p-2 h-auto min-h-[60px] w-16 rounded-lg transition-colors ${
              activeView === item.id 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs leading-none">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}