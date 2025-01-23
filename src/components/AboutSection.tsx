import React from 'react';
import { Award, BookOpen, Users } from 'lucide-react';

export default function AboutSection() {
  const achievements = [
    {
      icon: BookOpen,
      title: "Research Excellence",
      description: "Published over 50 papers in top-tier journals"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Worked with 100+ researchers worldwide"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Received multiple research awards"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="prose prose-invert">
        <p className="text-gray-300 leading-relaxed">
          I am a dedicated researcher with over 10 years of experience in artificial intelligence 
          and machine learning. My work focuses on developing innovative solutions that bridge 
          the gap between theoretical research and practical applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className="group relative p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 
                     hover:bg-purple-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 
                          opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            />
            <achievement.icon className="h-8 w-8 text-purple-400 mb-3 transform group-hover:scale-110 
                                      transition-transform duration-300" />
            <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
            <p className="text-sm text-gray-400">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}