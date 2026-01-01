import { BadgeCheck } from 'lucide-react';

interface SkillContent {
    category: string;
    items: string[];
}

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
                <div key={skill.SK} className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BadgeCheck className="mr-2 text-primary h-5 w-5" />
                        {skill.content.category}
                    </h3>
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
