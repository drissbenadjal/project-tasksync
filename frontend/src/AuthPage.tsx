import { AuthMidleware } from "./components/AuthMidleware/AuthMidleware";
import { Loader } from "./components/Loader/Loader";

// console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function AuthPage() {
  AuthMidleware();
  return (
    <Loader />
  );
}

export default AuthPage;
