import { useState, type JSX } from "react";
import {
  deriveFromPassphrase,
  type DerivedResult,
} from "@/lib/deriveFromPassphrase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import StrengthMeter from "@/components/StrengthMeter";
import { useToast } from "@/components/ui/toast";

export default function WalletGenerator(): JSX.Element {
  const [passphrase, setPassphrase] = useState<string>("");
  const [result, setResult] = useState<DerivedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletGenerated, setWalletGenerated] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!passphrase.trim()) {
      setError("Passphrase cannot be empty");
      return;
    }
    if (!acknowledged) {
      setError("You must acknowledge the terms");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // ⬇️ force render
      await new Promise((r) => setTimeout(r, 0));
      console.log("Starting wallet derivation...");
      const startTime = Date.now();
      const derived = await deriveFromPassphrase(passphrase);
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Wallet derivation completed in ${duration}ms`);

      // Ensure minimum loading time for UX (1 second)
      if (duration < 1000) {
        console.log(`Derivation was too fast (${duration}ms), adding delay...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 - duration));
      }

      setResult(derived);
      setWalletGenerated(true);

      // Prevent form resubmission on page reload
      if (window.history.replaceState) {
        window.history.replaceState(null, "", window.location.href);
      }
    } catch (err) {
      console.error("Derivation failed", err);
      setError("Failed to generate wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPassphrase("");
    setResult(null);
    setAcknowledged(false);
    setError(null);
  };

  const { showToast } = useToast();

  const handleCopyToClipboard = (
    text: string,
    type: "mnemonic" | "privateKey",
  ) => {
    // Fallback for mobile browsers that don't support navigator.clipboard
    const copyFallback = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const success = document.execCommand("copy");
        if (success) {
          const itemName =
            type === "mnemonic" ? "Mnemonic phrase" : "Private key";
          showToast(`${itemName} copied to clipboard!`, "success");
        } else {
          showToast("Failed to copy to clipboard", "error");
        }
      } catch (err) {
        console.error("Fallback copy failed:", err);
        showToast("Failed to copy to clipboard", "error");
      }

      document.body.removeChild(textarea);
    };

    // Try modern clipboard API first
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const itemName =
            type === "mnemonic" ? "Mnemonic phrase" : "Private key";
          showToast(`${itemName} copied to clipboard!`, "success");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          // Fall back to execCommand for mobile browsers
          copyFallback();
        });
    } else {
      // Browser doesn't support clipboard API
      copyFallback();
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center py-1">
            Wallet Generator
          </CardTitle>
          <CardDescription className="text-center">
            Generate deterministic wallet keys from your secret passphrase
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="passphrase"
              className="text-sm font-medium leading-none cursor-pointer hover:text-foreground transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Secret Passphrase
            </label>
            <textarea
              id="passphrase"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (walletGenerated) {
                  handleReset();
                  setWalletGenerated(false);
                }
              }}
              placeholder="Enter your secret passphrase"
              autoCorrect="off"
              spellCheck={false}
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center text-center",
                error ? "border-destructive" : "",
              )}
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}

            <StrengthMeter passphrase={passphrase} />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acknowledgment"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border border-input bg-background text-primary shadow-sm hover:cursor-pointer hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
            <label
              htmlFor="acknowledgment"
              className="text-sm text-muted-foreground leading-none cursor-pointer hover:text-foreground transition-colors"
            >
              I understand these keys are derived from my passphrase and I am
              responsible for their security.
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading || (!result && !passphrase)}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button
            variant="default"
            onClick={handleGenerate}
            disabled={loading || !passphrase.trim() || !acknowledged}
            className="min-w-[120px] cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                      fill="currentColor"
                      opacity="0.2"
                    />
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12H4C4 7.59 7.59 4 12 4V2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Generating...
              </>
            ) : (
              "Generate Wallet"
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              Generated Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Mnemonic Phrase
                </p>
                <button
                  onClick={() =>
                    handleCopyToClipboard(result.mnemonic, "mnemonic")
                  }
                  className="text-sm cursor-pointer hover:text-foreground transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <div className="break-words rounded-md border border-input bg-muted/50 p-3 text-sm font-mono">
                {result.mnemonic}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Private Key
                </p>
                <button
                  onClick={() =>
                    handleCopyToClipboard(result.privateKeyHex, "privateKey")
                  }
                  className="text-sm cursor-pointer hover:text-foreground transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <div className="break-all rounded-md border border-input bg-muted/50 p-3 text-sm font-mono">
                {result.privateKeyHex}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center">
              ⚠️ Store these securely. Anyone with access to this information
              can control your wallet.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
