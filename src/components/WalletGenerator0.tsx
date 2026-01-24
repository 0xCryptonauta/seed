import { useState, type JSX } from "react";
import {
  deriveFromPassphrase,
  type DerivedResult,
} from "@/lib/deriveFromPassphrase";

export default function DeterministicMnemonicGenerator(): JSX.Element {
  const [passphrase, setPassphrase] = useState<string>("");
  const [result, setResult] = useState<DerivedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!passphrase || !acknowledged) return;
    setLoading(true);
    try {
      const derived = await deriveFromPassphrase(passphrase);
      setResult(derived);
    } catch (err) {
      console.error("Derivation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      {/* ... (Your existing UI code) ... */}
      <h2>Deterministic Mnemonic Generator</h2>

      <textarea
        style={{ width: "100%", padding: "10px" }}
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Enter your secret passphrase"
      />

      <div style={{ margin: "10px 0" }}>
        <input
          type="checkbox"
          id="ack"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />
        <label htmlFor="ack">
          {" "}
          I understand these keys are derived from my password.
        </label>
      </div>

      <button onClick={handleGenerate} disabled={loading || !acknowledged}>
        {loading ? "Computing..." : "Generate"}
      </button>

      {result && (
        <div style={{ marginTop: 20, background: "#f4f4f4", padding: 15 }}>
          <strong>Mnemonic:</strong>
          <p>{result.mnemonic}</p>
          <strong>Private Key:</strong>
          <p style={{ wordBreak: "break-all" }}>{result.privateKeyHex}</p>
        </div>
      )}
    </div>
  );
}
