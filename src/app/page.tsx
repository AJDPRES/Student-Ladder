import HomepageHeader from "@/components/sections/HomepageHeader";
import RecentJobsSection from "@/components/sections/RecentJobsSection";
import DiscoverCareersSection from "@/components/sections/DiscoverCareersSection";
import FindCompanySection from "@/components/sections/FindCompanySection";

export default function Page() {
  return (
    <main>
      <HomepageHeader />
      <RecentJobsSection />
      <DiscoverCareersSection />
      <FindCompanySection />
    </main>
  );
}
