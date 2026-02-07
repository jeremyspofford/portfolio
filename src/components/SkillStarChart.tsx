'use client';

import { Star } from 'lucide-react';

export interface SkillMatch {
  skill: string;
  rating: number;
  description: string;
}

interface SkillStarChartProps {
  skills: SkillMatch[];
  overallScore?: number;
}

export function SkillStarChart({ skills, overallScore }: SkillStarChartProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No skill matches found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Skill Match Analysis
      </h3>

      {overallScore !== undefined && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="text-4xl font-bold text-indigo-600">
            {overallScore}%
          </div>
          <div className="text-sm text-muted-foreground">
            Overall Match
          </div>
        </div>
      )}

      <div className="space-y-4">
        {skills.map((skillMatch) => {
          const cappedRating = Math.min(Math.max(skillMatch.rating, 0), 5);

          return (
            <div
              key={skillMatch.skill}
              data-skill-row
              data-rating={cappedRating}
              className="p-4 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">
                  {skillMatch.skill}
                </span>
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`${skillMatch.skill}: ${cappedRating} out of 5 stars`}
                  role="img"
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < cappedRating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {skillMatch.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
