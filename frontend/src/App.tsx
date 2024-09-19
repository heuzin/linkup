import AuthModal from "./components/AuthModal";
import EditProfileMoedal from "./components/EditProfileMoedal";
import { useGeneralStore } from "./store/generalStore";

function App() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  const isEditProfileOpen = useGeneralStore((state) => state.isEditProfileOpen);
  return (
    <div>
      {isLoginOpen && <AuthModal />}{" "}
      {isEditProfileOpen && <EditProfileMoedal />}
    </div>
  );
}

export default App;
