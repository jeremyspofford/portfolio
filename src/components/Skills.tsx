import { BadgeCheck, Terminal, Cloud, Database, Cpu, Globe, Code, Layers, Shield, Box, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SkillContent } from '@/lib/api';

interface SkillItem {
    PK: string;
    SK: string;
    content: SkillContent;
}

interface SkillsProps {
    items: SkillItem[];
}

export function Skills({ items }: SkillsProps) {
  return (
    <section className="w-full py-10 md:py-24 px-4 bg-background">
      <div className="container px-2 sm:px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-8 md:mb-12 text-center">Technical Skills</h2>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((skill) => (
                <div key={skill.SK} className="border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors bg-card">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                           {getIcon(skill.content.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-2">
                                <h3 className="text-base sm:text-lg font-semibold truncate">{skill.content.category}</h3>
                                {skill.content.proficiency && (
                                    <span className="text-xs sm:text-sm font-medium text-primary flex-shrink-0">{skill.content.proficiency}%</span>
                                )}
                            </div>
                            {skill.content.proficiency && (
                                <div className="w-full bg-secondary rounded-full h-1.5 sm:h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${skill.content.proficiency}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {skill.content.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                            {skill.content.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {skill.content.items.map(item => (
                            <span key={item} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function getIcon(name?: string) {
    const icons: Record<string, LucideIcon> = {
        'cloud': Cloud,
        'terminal': Terminal,
        'database': Database,
        'cpu': Cpu,
        'globe': Globe,
        'code': Code,
        'layers': Layers,
        'shield': Shield,
        'box': Box,
        'server': Server
    };

    const Icon = name ? icons[name.toLowerCase()] || BadgeCheck : BadgeCheck;
    return <Icon className="w-5 h-5 text-primary" />;
}
