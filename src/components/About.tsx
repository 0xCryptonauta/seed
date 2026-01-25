import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
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

          <div className="flex flex-col sm:flex-row gap-2 pt-4"></div>

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
