import { useState } from "react";
import { Navbar } from "./components/Navbar";
import DeterministicMnemonicGenerator from "./components/WalletGenerator";
import About from "./components/About";
import { ToastProvider } from "./components/ui/toast";
import { Footer } from "./components/Footer";
import { InstallPWA } from "./components/InstallPWA";

function App() {
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const toggleView = () => {
    setShowAbout(!showAbout);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar onLogoClick={toggleView} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {showAbout ? <About /> : <DeterministicMnemonicGenerator />}
        </main>
        <InstallPWA />
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
