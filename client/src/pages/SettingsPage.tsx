import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Bell, Shield, Database, ArrowLeft } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Go Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-6 group"
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
          <p className="text-[var(--text-secondary)]">
            Customize your Z-Challenge experience
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--accent-purple)]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                Account Settings
              </h2>
            </div>
            <div className="text-[var(--text-secondary)]">
              <p>Account settings are available on your profile page.</p>
              <p className="text-sm mt-2">
                • Update profile picture
                • Change display name
                • View account information
              </p>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent-cyan)]/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[var(--accent-cyan)]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                Notifications
              </h2>
            </div>
            <div className="text-[var(--text-secondary)]">
              <p>Notification preferences coming soon...</p>
              <p className="text-sm mt-2">
                • Challenge completion alerts
                • Leaderboard position updates
                • New challenge notifications
              </p>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[var(--accent-purple)]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                Privacy & Security
              </h2>
            </div>
            <div className="text-[var(--text-secondary)]">
              <p>Privacy and security settings coming soon...</p>
              <p className="text-sm mt-2">
                • Profile visibility controls
                • Account security settings
                • Data export options
              </p>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent-cyan)]/20 rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-[var(--accent-cyan)]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                Data Management
              </h2>
            </div>
            <div className="text-[var(--text-secondary)]">
              <p>Data management options coming soon...</p>
              <p className="text-sm mt-2">
                • Export submission history
                • Download profile data
                • Account deletion request
              </p>
            </div>
          </motion.div>
        </div>


      </div>
    </div>
  );
};