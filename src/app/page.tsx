import { Hero } from "@/components/Hero";
import { Testimonial } from "@/components/Testimonial";
import { SelectedWriting } from "@/components/SelectedWriting";
import { Contact } from "@/components/Contact";
import { fetchContent } from '@/lib/content';
import { ProfileContent } from '@/lib/api';

export default async function Home() {
  const profileData = await fetchContent("PROFILE");
  const profile = profileData.find((item) => item.SK === "MAIN")?.content as ProfileContent | undefined;

  return (
    <div className="flex flex-col w-full bg-bg-primary">
      <Hero profile={profile} />
      <Testimonial />
      <SelectedWriting />
      <Contact profile={profile} />
    </div>
  );
}
