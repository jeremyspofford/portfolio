import { BadgeCheck, Terminal, Cloud, Database, Cpu, Globe, Code, Layers } from 'lucide-react';
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
    <section className="w-full py-12 md:py-24 px-4 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">Technical Skills</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((skill) => (
                <div key={skill.SK} className="border rounded-lg p-6 hover:border-primary/50 transition-colors bg-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                           {getIcon(skill.content.icon)}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{skill.content.category}</h3>
                        </div>
                    </div>
                    
                    {skill.content.description && (
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {skill.content.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {skill.content.items.map(item => (
                            <span key={item} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
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
    const icons: Record<string, any> = {
        'cloud': Cloud,
        'terminal': Terminal,
        'database': Database,
        'cpu': Cpu,
        'globe': Globe,
        'code': Code,
        'layers': Layers
    };
    
    const Icon = name ? icons[name.toLowerCase()] : BadgeCheck;
    return <Icon className="w-5 h-5 text-primary" />;
}
