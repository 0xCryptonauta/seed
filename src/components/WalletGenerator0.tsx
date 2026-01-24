import { useState } from "react";
import * as bip39 from "bip39";
import * as secp from "@noble/secp256k1";

type DerivedResult = {
  mnemonic: string;
  privateKeyHex: string;
};

export default function DeterministicMnemonicGenerator(): JSX.Element {
  const [passphrase, setPassphrase] = useState<string>("");
  const [result, setResult] = useState<DerivedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  async function deriveFromPassphrase(
    passphrase: string,
  ): Promise<DerivedResult> {
    const enc = new TextEncoder();

    // --- HMAC-SHA256 helper (HKDF expand) ---
    async function hmacSha256(
      keyBytes: Uint8Array,
      dataBytes: Uint8Array,
    ): Promise<Uint8Array> {
      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const sig = await crypto.subtle.sign("HMAC", key, dataBytes);
      return new Uint8Array(sig);
    }

    // 1. Normalize (critical for determinism)
    const normalized = passphrase.normalize("NFKD");

    // 2. PBKDF2 (slow, password-hardening)
    const baseKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(normalized),
      "PBKDF2",
      false,
      ["deriveBits"],
    );

    const ikmBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode("deterministic-seed-v1"),
        iterations: 600_000,
        hash: "SHA-256",
      },
      baseKey,
      256,
    );

    const ikm = new Uint8Array(ikmBits);

    // 3. HKDF-Expand (HMAC-based)
    const info = enc.encode("root-key");
    const okm = await hmacSha256(ikm, info);
    const rootKey = okm.slice(0, 32);

    // 4a. Mnemonic (24 words)
    const entropyHex = Array.from(rootKey)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const mnemonic = bip39.entropyToMnemonic(entropyHex);

    // 4b. secp256k1 private key
    const privateKeyBytes = secp.utils.hashToPrivateKey(rootKey);
    const privateKeyHex = secp.utils.bytesToHex(privateKeyBytes);

    return { mnemonic, privateKeyHex };
  }

  async function handleGenerate(): Promise<void> {
    if (!passphrase || !acknowledged) return;
    setLoading(true);
    setResult(null);

    try {
      const derived = await deriveFromPassphrase(passphrase);
      setResult(derived);
    } finally {
      setLoading(false);
    }
  }

  const weakPassphrase = passphrase.length < 12;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>Deterministic Mnemonic Generator</h2>

      <p style={{ fontSize: 14, opacity: 0.85 }}>
        Generate a deterministic mnemonic and private key from a passphrase.
        <strong> No randomness. No storage.</strong>
      </p>

      <textarea
        rows={3}
        placeholder="Enter a strong passphrase"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderColor: weakPassphrase ? "#e67e22" : "#ccc",
        }}
      />

      {weakPassphrase && passphrase && (
        <p style={{ color: "#e67e22", fontSize: 13 }}>
          ⚠️ Passphrase is short. Security depends entirely on passphrase
          strength.
        </p>
      )}

      <label style={{ display: "block", marginTop: 12, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />{" "}
        I understand this is <strong>password-derived</strong> and not a random
        wallet seed.
      </label>

      <button
        onClick={handleGenerate}
        disabled={!passphrase || !acknowledged || loading}
        style={{
          marginTop: 12,
          padding: "10px 18px",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Deriving…" : "Generate"}
      </button>

      {result && (
        <>
          <h3 style={{ marginTop: 24 }}>Mnemonic (24 words)</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f6f6f6",
              padding: 12,
            }}
          >
            {result.mnemonic}
          </pre>

          <h3>Private Key (hex)</h3>
          <pre
            style={{
              background: "#f6f6f6",
              padding: 12,
              wordBreak: "break-all",
            }}
          >
            {result.privateKeyHex}
          </pre>
        </>
      )}

      <div
        style={{
          marginTop: 20,
          fontSize: 12,
          opacity: 0.75,
          borderTop: "1px solid #ddd",
          paddingTop: 12,
        }}
      >
        ⚠️ <strong>Security notice:</strong> These keys are deterministically
        derived from your passphrase. Anyone who guesses the same passphrase can
        regenerate the same keys. Use only strong, unique phrases and avoid
        using this for high-value funds.
      </div>
    </div>
  );
}
