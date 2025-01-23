import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Profile</h2>
      <div className="royal-card p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <img src="path/to/profile-picture.jpg" alt="Profile Picture" className="w-16 h-16 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold text-white">Full Name</h3>
            <p className="text-gray-400">Email Address</p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-white">Academic Information</h4>
          <p className="text-gray-400">Affiliation: University/Institution</p>
          <p className="text-gray-400">Research Interests: Machine Learning, Healthcare</p>
          <p className="text-gray-400">Published Papers: 10</p>
          <p className="text-gray-400">Citations: 500</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-white">Additional Information</h4>
          <p className="text-gray-400">Contact Information: Phone Number</p>
          <p className="text-gray-400">Social Media Links: LinkedIn, Twitter</p>
          <p className="text-gray-400">Bio/About Section: Brief description about the user</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
