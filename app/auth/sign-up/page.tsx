import { SignUpForm } from "@/components/auth/sign-up-form";
import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";

export default function SignUpPage() {
  return (
    <MotionToggleWrapper>
      <div className="w-[100vw] h-[100vh] relative pointer-events-none overflow-hidden">
        <div 
        className="fixed top-0 bottom-0 left-0 w-[100vw] backdrop-invert-[1] z-0"
        style={{
          maskImage: 'linear-gradient(90deg, black 0%, black 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 75%, transparent 90%)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%,  transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 20%, rgba(0,0,0,0.8) 40%,  rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 75%, transparent 90%)',
          transform: 'translateZ(0)', 
          backfaceVisibility: 'hidden'
          }}
        />

         <div className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-0 md:pl-[8%] z-10 pointer-events-auto">
          <div className="w-full max-w-sm">
              <SignUpForm className="bg-transparent border-none shadow-none" />
          </div>
        </div>

      </div>
    </MotionToggleWrapper>
  );
}