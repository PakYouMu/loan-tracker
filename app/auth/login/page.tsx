import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";
import { ThemeBasedLoginForms } from "@/components/theme-based/theme-based-login-forms";

export default function LoginPage() {
  return (
    <MotionToggleWrapper>
      <div className="w-[100vw] h-[100vh] relative pointer-events-none overflow-hidden">
        <div 
          className="fixed top-0 bottom-0 left-0 w-[100vw] backdrop-invert-[1] z-0"
          style={{
            maskImage: 'linear-gradient(90deg, black 0%, black 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 75%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 75%, transparent 90%)',
            transform: 'translateZ(0)', 
            backfaceVisibility: 'hidden'
          }}
        />

        <ThemeBasedLoginForms />
      </div>
    </MotionToggleWrapper>
  );
}