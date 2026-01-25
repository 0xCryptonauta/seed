import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }
}

export default function About() {
  const [installable, setInstallable] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallable(true);
      setInstallEvent(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as any,
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as any,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installEvent) return;

    try {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setInstallable(false);
      setInstallEvent(null);
    } catch (error) {
      console.error("Installation error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center py-1">
            About This Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            This is a deterministic wallet generator that creates cryptographic
            keys from your secret passphrase using industry-standard algorithms.
          </p>

          <p>
            The tool uses BIP-39 mnemonic generation and BIP-32 hierarchical
            deterministic wallet derivation to create secure wallet keys.
          </p>

          <div className="space-y-2">
            <h3 className="font-medium">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Deterministic key generation from passphrases</li>
              <li>BIP-39 compliant mnemonic phrases</li>
              <li>Secure cryptographic algorithms</li>
              <li>Client-side only processing (no data leaves your browser)</li>
              <li>Open source and auditable</li>
              <li>Progressive Web App - installable and works offline</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Important Security Notes:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Never share your passphrase or generated keys</li>
              <li>Store your mnemonic phrase securely offline</li>
              <li>This tool is for educational and testing purposes</li>
              <li>Always verify generated addresses before using</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {installable && (
              <Button
                onClick={handleInstallClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                📱 Install App
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Remember: The security of your wallet depends entirely on the
            strength of your passphrase and how securely you store your
            generated keys.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
