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
        <CardContent className="space-y-4 text-sm flex flex-col items-center">
          <p
            style={{
              color: "darkred",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            THIS IS FOR LEARNING AND TESTING - BE CARFUL WITH REAL MONEY
          </p>
          <p style={{ textAlign: "center" }}>
            This tool creates crypto wallet keys from your secret passphrase.
            It's like a magic key maker - you give it a secret word, and it
            gives you back special codes that can be used for crypto wallets.
          </p>

          <p style={{ textAlign: "center" }}>
            Think of it like a password generator for crypto. You put in a
            secret phrase, and it creates all the special codes needed to access
            crypto wallets.
          </p>

          <div className="space-y-2">
            <h2 className="font-bold text-center">What it does:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Turns your secret phrase into crypto keys
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li style={{ color: "darkred" }}>
                    Worst wallet you can get.
                  </li>
                </ul>
              </li>
              <li>
                Creates easy-to-remember word lists (like a backup password)
              </li>
              <li>Uses strong security methods to keep things safe</li>
              <li>Works only in your browser - nothing gets sent online</li>
              <li>You can check how it works (it's open source)</li>
              <li>
                Can be installed on your device and works without internet
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-center font-bold">Important Safety Tips:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Never tell anyone your secret phrase or the keys it creates
              </li>
              <li>Write down your backup words and keep them safe offline</li>
              <li>Double-check everything before using the keys for real</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center sm:flex-row gap-2 pt-4 py-5">
            <p
              style={{
                whiteSpace: "pre",
                fontFamily: "monospace",
                overflowX: "auto",
              }}
            >
              {`
    [Passphrase]
          V
[Normalize - Encode]
          V
     [Root Key]
          V
      [PBKDF2] --> [Mnemonic]
          V
    [Private Key]
`}
            </p>
          </div>

          <p
            className="text-xs text-muted-foreground"
            style={{ textAlign: "center", color: "darkred" }}
          >
            Remember: The security of your wallet depends entirely on the
            strength of your passphrase and how securely you store your
            generated keys.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
