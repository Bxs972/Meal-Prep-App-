import { useState } from "react";
import { Settings, User, Bell, Palette, Database, Download, Upload, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";

interface SettingsPageProps {
  onExportData: () => void;
  onImportData: (data: any) => void;
  onClearData: () => void;
}

export function SettingsPage({ onExportData, onImportData, onClearData }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    userName: localStorage.getItem('meal-planner-username') || '',
    email: localStorage.getItem('meal-planner-email') || '',
    notifications: localStorage.getItem('meal-planner-notifications') === 'true',
    darkMode: localStorage.getItem('meal-planner-darkmode') === 'true',
    language: localStorage.getItem('meal-planner-language') || 'en',
    startOfWeek: localStorage.getItem('meal-planner-startofweek') || 'monday'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`meal-planner-${key.toLowerCase()}`, value.toString());
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImportData(data);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-gray-800 mb-2">
          <span className="text-primary">Settings</span>
        </h1>
        <p className="text-gray-600">Manage your meal planner preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                value={settings.userName}
                onChange={(e) => updateSetting('userName', e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive meal planning reminders</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
            
            <div>
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start of Week</Label>
              <Select value={settings.startOfWeek} onValueChange={(value) => updateSetting('startOfWeek', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Management
          </h3>
          
          <div className="space-y-4">
            <div>
              <Button onClick={onExportData} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <p className="text-xs text-gray-500 mt-1">Download your meals and recipes as JSON</p>
            </div>
            
            <div>
              <Label htmlFor="import-file" className="cursor-pointer">
                <Button asChild className="w-full" variant="outline">
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </div>
                </Button>
              </Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">Upload a JSON file to restore data</p>
            </div>
            
            <Separator />
            
            <div>
              <Button 
                onClick={onClearData} 
                className="w-full" 
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
              <p className="text-xs text-gray-500 mt-1">This action cannot be undone</p>
            </div>
          </div>
        </Card>
      </div>

      {/* About */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-800 mb-4">About</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <p className="text-gray-800 mb-1">Version</p>
            <p>1.0.0</p>
          </div>
          <div>
            <p className="text-gray-800 mb-1">Last Updated</p>
            <p>January 2025</p>
          </div>
          <div>
            <p className="text-gray-800 mb-1">Storage</p>
            <p>Local Browser Storage</p>
          </div>
        </div>
      </Card>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          Your settings are automatically saved to your browser's local storage.
        </AlertDescription>
      </Alert>
    </div>
  );
}