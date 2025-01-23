import React from 'react';
import { Star, GraduationCap, Building } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  college: string;
  designation: string;
  review: string;
  rating: number;
  image: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    college: "IIT Delhi",
    designation: "Final Year B.Tech Student",
    review: "ResearchX helped me complete my thesis in record time. Their expertise in research paper writing is unmatched. Highly recommended for all engineering students!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    name: "Rahul Patel",
    college: "BITS Pilani",
    designation: "M.Tech Scholar",
    review: "As a postgraduate student, finding time for research papers was challenging. ResearchX made it simple and efficient. Their team understands academic requirements perfectly.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    name: "Anjali Desai",
    college: "VIT Vellore",
    designation: "Research Scholar",
    review: "The quality of research papers provided by ResearchX is exceptional. They helped me publish in top-tier journals. Their attention to detail is remarkable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 4,
    name: "Arjun Reddy",
    college: "NIT Trichy",
    designation: "Final Year Student",
    review: "I was struggling with my research paper deadlines until I found ResearchX. They delivered high-quality work within a short timeframe. Simply amazing!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export default function ReviewsSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="royal-card p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-center space-x-4">
              <img
                src={review.image}
                alt={review.name}
                className="w-16 h-16 rounded-full border-2 border-purple-500/30"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <GraduationCap className="h-4 w-4 text-purple-400" />
                  <span>{review.college}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Building className="h-4 w-4 text-purple-400" />
                  <span>{review.designation}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 italic">&quot;{review.review}&quot;</p>
            
            <div className="flex items-center space-x-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}