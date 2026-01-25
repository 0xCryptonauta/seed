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
      const derived = await deriveFromPassphrase(passphrase);
      setResult(derived);
      setWalletGenerated(true);
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

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Copy successful
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
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
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center text-center",
                error ? "border-destructive" : "",
              )}
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
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
            {loading ? "Generating..." : "Generate Wallet"}
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
              <p className="text-sm text-muted-foreground mb-1 font-medium">
                Mnemonic Phrase
              </p>
              <div className="relative">
                <div className="break-words rounded-md border border-input bg-muted/50 p-3 text-sm font-mono">
                  {result.mnemonic}
                </div>
                <button
                  onClick={() => handleCopyToClipboard(result.mnemonic)}
                  className="absolute top-3 right-3 text-sm cursor-pointer hover:text-foreground transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">
                Private Key
              </p>
              <div className="relative">
                <div className="break-all rounded-md border border-input bg-muted/50 p-3 text-sm font-mono">
                  {result.privateKeyHex}
                </div>
                <button
                  onClick={() => handleCopyToClipboard(result.privateKeyHex)}
                  className="absolute top-3 right-3 text-sm cursor-pointer hover:text-foreground transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
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
