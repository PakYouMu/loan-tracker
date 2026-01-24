import { LoginForm } from "@/components/auth/login-form";
import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";

export default function Page() {
  return (
      <MotionToggleWrapper>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </MotionToggleWrapper>
  );
}
