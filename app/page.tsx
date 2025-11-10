import NavOverlay from "@/components/nav-overlay";
import { AuthButton } from "@/components/auth/auth-button";
import TutorialOverlay from "@/components/tutorial/tutorial-overlay";
import MotionToggleWrapper from "@/components/context/motion-toggle-wrapper";

export default function Home() {
  return (
    <div className="h-screen relative isolate">
      <NavOverlay>
        <AuthButton />
      </NavOverlay>

      <MotionToggleWrapper>
        <div className="w-full max-w-5xl px-5">
          <h1 className="font-serif text-[clamp(2rem,8vw,4rem)] leading-tight text-center">
            <span>WHERE YOU KEEP</span><br />
            <span>YOUR FINANCES</span><br />
            <span>STRAIGHT</span>
          </h1>
        </div>
      </MotionToggleWrapper>

      <TutorialOverlay />
    </div>
  );
}