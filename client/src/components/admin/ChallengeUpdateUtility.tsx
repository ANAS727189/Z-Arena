import { useState } from 'react';
import { updateExistingChallenges } from '@/utils/updateChallenges';
import { seedChallenges } from '@/utils/seedChallenges';
import { replaceAsyncScraperChallenge } from '@/utils/replaceChallenge';

const ChallengeUpdateUtility = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateChallenges = async () => {
    setIsUpdating(true);
    setMessage('Updating existing challenges...');
    try {
      await updateExistingChallenges();
      setMessage('✅ Successfully updated all existing challenges!');
    } catch (error) {
      setMessage(`❌ Error updating challenges: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSeedNewChallenges = async () => {
    setIsSeeding(true);
    setMessage('Seeding new challenges...');
    try {
      await seedChallenges();
      setMessage('✅ Successfully seeded new challenges!');
    } catch (error) {
      setMessage(`❌ Error seeding challenges: ${error}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReplaceAsyncScraper = async () => {
    setIsReplacing(true);
    setMessage('Replacing async scraper challenge...');
    try {
      await replaceAsyncScraperChallenge();
      setMessage('✅ Successfully replaced async scraper challenge!');
    } catch (error) {
      setMessage(`❌ Error replacing challenge: ${error}`);
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Challenge Database Utility</h2>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handleUpdateChallenges}
            disabled={isUpdating}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Existing Challenges'}
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Updates existing challenges with proper language starter codes
          </p>
        </div>

        <div>
          <button 
            onClick={handleSeedNewChallenges}
            disabled={isSeeding}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed New Challenges'}
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Adds any new challenges from JSON files
          </p>
        </div>

        <div>
          <button 
            onClick={handleReplaceAsyncScraper}
            disabled={isReplacing}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isReplacing ? 'Replacing...' : 'Replace Async Scraper Challenge'}
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Replaces the problematic aiohttp challenge with a stdlib-only version
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default ChallengeUpdateUtility;