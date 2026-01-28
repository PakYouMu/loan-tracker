import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";
import AboutClient from "@/components/about/about-client";

export default function AboutPage() {
  return (
    <MotionToggleWrapper>
       <div className="w-full min-h-screen relative overflow-y-auto overflow-x-hidden pt-20 pb-10">
          <AboutClient />
       </div>
    </MotionToggleWrapper>
  );
}