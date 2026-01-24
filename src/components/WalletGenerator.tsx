import { useState } from "react";
import { generateMnemonic } from "bip39";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function WalletGenerator() {
  const [input, setInput] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const generateKeys = () => {
    // Generate private key (64 hex chars = 32 bytes)
    const keyBytes = new Uint8Array(32);
    crypto.getRandomValues(keyBytes);
    const keyHex = Array.from(keyBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setPrivateKey(`0x${keyHex}`);

    // Generate 24-word mnemonic (256 bits) or use provided input
    const mnemonicPhrase = input.trim() || generateMnemonic(256);
    setMnemonic(mnemonicPhrase);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Row 1: Input and Generate Button */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter seed phrase or leave empty for random"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={generateKeys}>Generate</Button>
      </div>

      {/* Row 2: Private Key */}
      <Card>
        <CardHeader>
          <CardTitle>Private Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-muted p-3 rounded-md break-all">
            {privateKey || "Click Generate to create a private key"}
          </div>
        </CardContent>
      </Card>

      {/* Row 3: Mnemonic */}
      <Card>
        <CardHeader>
          <CardTitle>Mnemonic (BIP-39)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-muted p-3 rounded-md">
            {mnemonic ? (
              <div className="grid grid-cols-4 gap-2">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center bg-background border rounded-md px-2 py-1 text-xs"
                  >
                    <span className="text-muted-foreground mr-1">
                      {index + 1}.
                    </span>
                    {word}
                  </div>
                ))}
              </div>
            ) : (
              "Click Generate to create a mnemonic phrase"
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
