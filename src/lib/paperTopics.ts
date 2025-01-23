// Topic categories and their related keywords
export const topicKeywords = {
  'artificial-intelligence': [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 
    'neural networks', 'nlp', 'computer vision', 'reinforcement learning'
  ],
  'computer-science': [
    'algorithms', 'data structures', 'programming', 'software', 'database',
    'distributed systems', 'cloud computing', 'operating systems', 'networking'
  ],
  'cybersecurity': [
    'security', 'privacy', 'cryptography', 'encryption', 'cybersecurity',
    'network security', 'malware', 'intrusion detection', 'authentication'
  ],
  'data-science': [
    'data analysis', 'big data', 'data mining', 'statistics', 'visualization',
    'predictive analytics', 'data processing', 'business intelligence'
  ],
  'robotics': [
    'robotics', 'robot', 'automation', 'control systems', 'manipulators',
    'autonomous systems', 'robotic vision', 'industrial robots'
  ],
  'iot': [
    'iot', 'internet of things', 'sensors', 'embedded systems', 'smart devices',
    'wireless networks', 'mqtt', 'edge computing'
  ],
  'web-development': [
    'web', 'frontend', 'backend', 'full stack', 'javascript', 'html', 'css',
    'web services', 'api', 'responsive design'
  ],
  'mobile-computing': [
    'mobile', 'android', 'ios', 'app development', 'mobile security',
    'mobile networks', 'wireless communication'
  ],
  'cloud-computing': [
    'cloud', 'aws', 'azure', 'google cloud', 'virtualization', 'containers',
    'microservices', 'serverless', 'cloud storage'
  ],
  'blockchain': [
    'blockchain', 'cryptocurrency', 'smart contracts', 'distributed ledger',
    'consensus', 'bitcoin', 'ethereum', 'web3'
  ],
  'software-engineering': [
    'software engineering', 'design patterns', 'architecture', 'agile',
    'testing', 'devops', 'continuous integration', 'version control'
  ],
  'quantum-computing': [
    'quantum', 'quantum computing', 'qubits', 'quantum algorithms',
    'quantum cryptography', 'quantum networks'
  ],
  'ar-vr': [
    'augmented reality', 'virtual reality', 'ar', 'vr', 'mixed reality',
    'xr', 'immersive computing'
  ],
  'human-computer-interaction': [
    'hci', 'user interface', 'ui', 'ux', 'user experience', 'interaction design',
    'usability', 'accessibility'
  ],
  'computer-graphics': [
    'computer graphics', '3d', 'rendering', 'animation', 'visualization',
    'game development', 'image processing'
  ]
};

// Map keywords to topics
export const getRelevantTopics = (keywords: string[]): string[] => {
  const lowercaseKeywords = keywords.map(k => k.toLowerCase());
  const relevantTopics = new Set<string>();

  Object.entries(topicKeywords).forEach(([topic, relatedKeywords]) => {
    if (lowercaseKeywords.some(keyword => 
      relatedKeywords.some(topicKeyword => 
        topicKeyword.includes(keyword) || keyword.includes(topicKeyword)
      )
    )) {
      relevantTopics.add(topic);
    }
  });

  return Array.from(relevantTopics);
};
