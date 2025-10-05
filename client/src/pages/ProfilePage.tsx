import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Star,
  Upload,
  Loader2,
  Check,
  X,
  Edit3,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cloudinaryService } from '../services/cloudinaryService';
import { challengeService } from '../services/challengeService';
import { userService } from '../services/userService';
import { leaderboardService } from '../services/leaderboardService';
import type { UserStatsDocument } from '../services/challengeService';
import type { StarLevel } from '../services/leaderboardService';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStatsDocument | null>(null);
  const [starLevel, setStarLevel] = useState<StarLevel | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserStats();
      setNewName(user.name || '');
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;
    try {
      // Ensure user stats exist first
      await userService.initializeUserStats();
      
      // Then load the stats
      const stats = await challengeService.getUserStats(user.$id);
      setUserStats(stats);

      // Load the star level from database
      if (stats) {
        const userStarLevel = await leaderboardService.getLeaderboard({ timeframe: 'all', category: 'points' });
        const currentUser = userStarLevel.find(u => u.userId === user.$id);
        if (currentUser) {
          setStarLevel(currentUser.starLevel);
        }
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-white mb-4">
            Please sign in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  // Generate a random avatar if no profile image
  const getRandomAvatar = () => {
    const seed = user.$id || user.email;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=transparent`;
  };

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    (user?.prefs as any)?.profileImage || null
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Upload to Cloudinary
      const result = await cloudinaryService.uploadImage(file);

      // Update user preferences with the new image URL
      await userService.updateProfileImage(result.secure_url);

      // Update local state immediately for better UX
      setProfileImageUrl(result.secure_url);

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image';
      setUploadError(errorMessage);
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditingName(false);
      return;
    }

    setIsUpdatingName(true);
    try {
      // Use userService to update name in both account and user stats
      await userService.updateUserName(newName.trim());
      setIsEditingName(false);
      // Refresh to show updated name
      window.location.reload();
    } catch (error) {
      console.error('Failed to update name:', error);
      setNewName(user.name || '');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const starInfo = starLevel || { 
    $id: 'noob',
    starLevel: 1,
    title: 'Noob', 
    pointsRequired: 0, 
    color: 'text-gray-400',
    icon: '⭐',
    $createdAt: '',
    $updatedAt: ''
  };

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
            My Profile
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your account settings and view your progress
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
              {/* Profile Image Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  <div className="relative">
                    <img
                      src={profileImageUrl || getRandomAvatar()}
                      alt={user.name || user.email}
                      className="w-32 h-32 rounded-full border-4 border-[var(--accent-purple)]/30 object-cover mx-auto transition-opacity group-hover:opacity-75"
                    />

                    {/* Hover Edit Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <div className="text-center">
                          <Edit3 className="w-8 h-8 text-white mx-auto mb-1" />
                          <p className="text-white text-xs font-medium">Edit</p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Upload Status */}
                  {uploadSuccess && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Updated!</span>
                    </motion.div>
                  )}

                  {uploadError && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 max-w-48"
                    >
                      <X className="w-4 h-4" />
                      <span className="truncate">{uploadError}</span>
                    </motion.div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="space-y-4">
                {/* Name */}
                <div className="text-center">
                  {isEditingName ? (
                    <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
                      <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="flex-1 bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-white text-center min-w-0"
                        placeholder="Enter your name"
                        onKeyPress={e =>
                          e.key === 'Enter' && handleNameUpdate()
                        }
                        autoFocus
                      />
                      <button
                        onClick={handleNameUpdate}
                        disabled={isUpdatingName}
                        className="flex-shrink-0 p-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-lg text-white transition-colors"
                      >
                        {isUpdatingName ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewName(user.name || '');
                        }}
                        className="flex-shrink-0 p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <h2 className="font-heading text-2xl font-bold text-white">
                        {user.name || 'Anonymous User'}
                      </h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-[var(--text-secondary)] hover:text-white transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-[var(--text-secondary)] mt-1">
                    {user.email}
                  </p>
                </div>

                {/* Star Level */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < starInfo.starLevel
                            ? `${starInfo.color} fill-current`
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`font-semibold ${starInfo.color}`}>
                    {starInfo.title}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {userStats?.totalPoints || 0} points
                  </p>
                </div>

                {/* Basic Info */}
                <div className="space-y-3 pt-4 border-t border-[var(--border-primary)]/30">
                  <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      User ID: {user.$id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Joined {formatDate(user.$createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats and Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-[var(--accent-purple)]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {userStats?.solvedChallenges.length || 0}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Solved Challenges
                </p>
              </div>

              <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[var(--accent-cyan)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-[var(--accent-cyan)]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {userStats?.totalSubmissions || 0}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Total Submissions
                </p>
              </div>

              <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {userStats
                    ? Math.round(
                        (userStats.successfulSubmissions /
                          Math.max(userStats.totalSubmissions, 1)) *
                          100
                      )
                    : 0}
                  %
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Success Rate
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
              <h3 className="font-heading text-xl font-bold text-white mb-4">
                Progress Overview
              </h3>

              <div className="space-y-4">
                {/* Points Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)]">
                      Current Level Progress
                    </span>
                    <span className="text-white font-semibold">
                      {userStats?.totalPoints || 0} pts
                    </span>
                  </div>
                  <div className="w-full bg-[var(--background-primary)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((userStats?.totalPoints || 0) / Math.max(starInfo.pointsRequired, 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="pt-4 border-t border-[var(--border-primary)]/30">
                  <h4 className="font-semibold text-white mb-3">
                    Recent Activity
                  </h4>
                  {userStats && userStats.solvedChallenges.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[var(--text-secondary)] text-sm">
                        🎉 Completed {userStats.solvedChallenges.length}{' '}
                        challenge
                        {userStats.solvedChallenges.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-[var(--text-secondary)] text-sm">
                        ⭐ Earned {userStats.totalPoints} total points
                      </p>
                      <p className="text-[var(--text-secondary)] text-sm">
                        🏆 Achieved {starInfo.title} level
                      </p>
                    </div>
                  ) : (
                    <p className="text-[var(--text-secondary)] text-sm">
                      No challenges completed yet. Start coding to see your
                      progress!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Instructions */}
            {!cloudinaryService.isConfigured() && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Upload className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold text-yellow-400">
                    Setup Required
                  </h4>
                </div>
                <p className="text-yellow-300 text-sm">
                  To enable profile picture uploads, please configure Cloudinary
                  settings in your .env file:
                </p>
                <ul className="text-yellow-300 text-sm mt-2 space-y-1 ml-4">
                  <li>• VITE_CLOUDINARY_CLOUD_NAME</li>
                  <li>• VITE_CLOUDINARY_UPLOAD_PRESET</li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
