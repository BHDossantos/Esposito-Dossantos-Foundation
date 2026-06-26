import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import MissionStatement from '@/components/sections/MissionStatement';
import Pillars from '@/components/sections/Pillars';
import ImpactMetrics from '@/components/sections/ImpactMetrics';
import FounderStory from '@/components/sections/FounderStory';
import FeaturedPrograms from '@/components/sections/FeaturedPrograms';
import DonationCallout from '@/components/sections/DonationCallout';
import EventsPreview from '@/components/sections/EventsPreview';
import NewsletterSection from '@/components/sections/NewsletterSection';
import FinalCTA from '@/components/sections/FinalCTA';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <MissionStatement />
      <Pillars />
      <ImpactMetrics />
      <FounderStory />
      <FeaturedPrograms />
      <DonationCallout />
      <EventsPreview />
      <NewsletterSection />
      <FinalCTA />
    </>
  );
}
