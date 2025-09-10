import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface MobileSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
}

export function MobileSearchModal({ open, onOpenChange, onSearch }: MobileSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onOpenChange(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClose = () => {
    setSearchQuery("");
    onSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Search Meals
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Search for meals and recipes in your meal planner
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for meals, recipes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              autoFocus
            />
          </div>
        </form>
        
        {searchQuery && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Searching for: "{searchQuery}"
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}