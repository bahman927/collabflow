import AuthModal        from "./AuthModal";
import Login            from "../pages/Login";
import SignUp           from "../pages/Signup";
import ForgotPassword   from "../pages/ForgotPassword";
import { useAuthModal } from "../context/AuthModalProvider";

const authComponents = {
  login: Login,
  signup: SignUp,
  forgotPassword: ForgotPassword,
};

export default function AuthModalRenderer() {
  const { authMode, closeModal } = useAuthModal();

  const SelectedComponent =
    authMode && authComponents[authMode];

  return (
    <AuthModal
      isOpen={!!authMode}
      onClose={closeModal}
    >
      {SelectedComponent && <SelectedComponent />}
    </AuthModal>
  );
}