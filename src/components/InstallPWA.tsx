import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): void;
}

export const InstallPWA = () => {
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installationError, setInstallationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
      console.log("PWA install prompt available");
    };

    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("App is already installed as PWA");
        setShowInstallButton(false);
      } else {
        window.addEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
          { once: true },
        );
      }
    };

    // Check if browser supports PWA installation
    if (!window.matchMedia) {
      setInstallationError("Browser does not support PWA installation");
      return;
    }

    checkIfInstalled();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult: { outcome: "accepted" | "dismissed"; platform: string }) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          setDeferredPrompt(null);
          setShowInstallButton(false);
        })
        .catch((error: unknown) => {
          console.error("Installation error:", error);
          setInstallationError("Failed to install PWA");
        });
    }
  };

  // Debug information
  useEffect(() => {
    console.log("InstallPWA component mounted");
    console.log("Show install button:", showInstallButton);
    console.log("Deferred prompt available:", !!deferredPrompt);
    console.log("Installation error:", installationError);
  }, [showInstallButton, deferredPrompt, installationError]);

  if (installationError) {
    return (
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-red-500 border-red-500"
          disabled
        >
          ⚠️ {installationError}
        </Button>
      </div>
    );
  }

  return (
    showInstallButton && (
      <div className="flex justify-center">
        <Button
          size="sm"
          onClick={handleInstallClick}
          className="h-8 px-3"
          title="Install PWA"
        >
          📥 Install
        </Button>
      </div>
    )
  );
};
