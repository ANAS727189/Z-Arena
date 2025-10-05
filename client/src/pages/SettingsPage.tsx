import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Database,
  ArrowLeft,
  Globe,
  Download,
  Eye,
  EyeOff,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';

interface UserSettings {
  theme: 'dark' | 'light';
  notifications: {
    challenges: boolean;
    leaderboard: boolean;
    achievements: boolean;
    email: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showStats: boolean;
    showSubmissions: boolean;
    showActivity: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    autoSave: boolean;
  };
}

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: {
      challenges: true,
      leaderboard: true,
      achievements: true,
      email: false,
    },
    privacy: {
      profileVisibility: 'public',
      showStats: true,
      showSubmissions: true,
      showActivity: true,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      autoSave: true,
    },
  });

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const prefs = await userService.getPreferences();
      if (prefs) {
        setSettings(prev => ({
          ...prev,
          theme: (prefs.theme as 'dark' | 'light') || prev.theme,
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await userService.updatePreferences(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNestedSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    const currentCategory = settings[category] as any;
    const newCategorySettings = { ...currentCategory, [key]: value };
    const newSettings = { ...settings, [category]: newCategorySettings };
    setSettings(newSettings);
    saveSettings({ [category]: newCategorySettings });
  };

  const exportData = async () => {
    try {
      // Export user data as JSON
      const userData = {
        settings,
        profile: user,
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `z-challenger-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'Deutsch' },
    { id: 'ja', name: '日本語' },
    { id: 'zh', name: '中文' },
  ];

  const timezones = [
    { id: 'UTC', name: 'UTC' },
    { id: 'America/New_York', name: 'Eastern Time' },
    { id: 'America/Chicago', name: 'Central Time' },
    { id: 'America/Denver', name: 'Mountain Time' },
    { id: 'America/Los_Angeles', name: 'Pacific Time' },
    { id: 'Europe/London', name: 'London' },
    { id: 'Europe/Paris', name: 'Paris' },
    { id: 'Asia/Tokyo', name: 'Tokyo' },
    { id: 'Asia/Shanghai', name: 'Shanghai' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Go Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-white/60">
            Customize your Z-Challenge experience
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="max-w-2xl mx-auto space-y-8">{/* Single column for cleaner layout */}

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Notifications</CardTitle>
                    <p className="text-white/50 text-sm mt-1">Control what notifications you receive</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Challenge Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">New Challenges</label>
                    <p className="text-xs text-white/60">Get notified when new challenges are published</p>
                  </div>
                  <Switch
                    checked={settings.notifications.challenges}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('notifications', 'challenges', checked)
                    }
                  />
                </div>

                {/* Leaderboard Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Leaderboard Updates</label>
                    <p className="text-xs text-white/60">Rank changes and position updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.leaderboard}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('notifications', 'leaderboard', checked)
                    }
                  />
                </div>

                {/* Achievement Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Achievements</label>
                    <p className="text-xs text-white/60">Celebrate your milestones and badges</p>
                  </div>
                  <Switch
                    checked={settings.notifications.achievements}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('notifications', 'achievements', checked)
                    }
                  />
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Email Notifications</label>
                    <p className="text-xs text-white/60">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('notifications', 'email', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Privacy & Security</CardTitle>
                    <p className="text-white/50 text-sm mt-1">Control your profile visibility and data sharing</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Visibility */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Profile Visibility</label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value: 'public' | 'private') => 
                      handleNestedSettingChange('privacy', 'profileVisibility', value)
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="public" className="text-white hover:bg-white/10">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>Public - Anyone can view your profile</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private" className="text-white hover:bg-white/10">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          <span>Private - Only you can view your profile</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Stats */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Show Statistics</label>
                    <p className="text-xs text-white/60">Display challenge completion stats publicly</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showStats}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('privacy', 'showStats', checked)
                    }
                  />
                </div>

                {/* Show Submissions */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Show Submissions</label>
                    <p className="text-xs text-white/60">Make your submission history visible to others</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showSubmissions}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('privacy', 'showSubmissions', checked)
                    }
                  />
                </div>

                {/* Show Activity */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Show Activity</label>
                    <p className="text-xs text-white/60">Display recent activity and progress</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showActivity}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('privacy', 'showActivity', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Preferences</CardTitle>
                    <p className="text-white/50 text-sm mt-1">Customize your experience and regional settings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className='flex gap-5'>
                                  {/* Language */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Language</label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => handleNestedSettingChange('preferences', 'language', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id} className="text-white hover:bg-white/10">
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Timezone</label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) => handleNestedSettingChange('preferences', 'timezone', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.id} value={tz.id} className="text-white hover:bg-white/10">
                          {tz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                </div>
                {/* Auto Save */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">Auto Save</label>
                    <p className="text-xs text-white/60">Automatically save your code while working</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => 
                      handleNestedSettingChange('preferences', 'autoSave', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Data & Account</CardTitle>
                    <p className="text-white/50 text-sm mt-1">Manage your data and account settings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Settings Link */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">Account Settings</h4>
                      <p className="text-xs text-white/60 mt-1">Update profile, name, and account details</p>
                    </div>
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                  <Button
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    className="w-full border-white/20 text-white cursor-pointer bg-black hover:bg-black hover:text-white transition-all"
                  >
                    Manage Account
                  </Button>
                </div>

                {/* Export Data */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">Export Data</h4>
                      <p className="text-xs text-white/60 mt-1">Download your profile and submission history</p>
                    </div>
                    <Download className="w-5 h-5 text-white/40" />
                  </div>
                  <Button
                    onClick={exportData}
                    className="w-full cursor-pointer bg-white text-black hover:bg-white/90 transition-all"
                  >
                    Export Profile Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Save Indicator */}
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4" />
            Settings saved
          </motion.div>
        )}
      </div>
    </div>
  );
};
