import NavOverlay from "@/components/landing-page/nav-overlay";
import { AuthButton } from "@/components/auth/auth-button";
import TutorialOverlay from "@/components/tutorial/tutorial-overlay";
import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";
import MetallicSheen from "@/components/wrappers/metallic-sheen-wrapper";

export default function Home() {
  return (
    <div className="h-screen relative isolate overflow-hidden">
      <NavOverlay>
        <AuthButton />
      </NavOverlay>

      <MotionToggleWrapper>
        <div className="w-full h-full px-5 flex flex-col items-center justify-center">
          
          <MetallicSheen>
            <h1 className="font-serif text-[clamp(2rem,8vw,4rem)] leading-tight text-center font-bold tracking-tighter py-4">
                <span>WHERE YOU KEEP</span>

              <br />
                <span>YOUR FINANCES</span>

              <br />
                <span>STRAIGHT</span>

            </h1>
          </MetallicSheen>

        </div>
      </MotionToggleWrapper>

      <TutorialOverlay />
    </div>
  );
}