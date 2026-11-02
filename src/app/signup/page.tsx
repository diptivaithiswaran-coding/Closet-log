import AuthForm from "../auth/AuthForm";
import { signUp } from "../auth/actions";

export default function SignupPage() {
  return <AuthForm mode="signup" action={signUp} />;
}
