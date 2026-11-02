import AuthForm from "../auth/AuthForm";
import { logIn } from "../auth/actions";

export default function LoginPage() {
  return <AuthForm mode="login" action={logIn} />;
}
