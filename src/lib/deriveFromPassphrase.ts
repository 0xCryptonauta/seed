import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";
import { bytesToHex } from "@noble/hashes/utils.js";

export type DerivedResult = {
  mnemonic: string;
  privateKeyHex: string;
};

export const deriveFromPassphrase = async (
  passphrase: string,
): Promise<DerivedResult> => {
  const enc = new TextEncoder();
  const normalized = passphrase.normalize("NFKD");
  const passwordBytes = enc.encode(normalized);
  const salt = enc.encode("deterministic-seed-v1");

  // 1. PBKDF2 (Hardens the passphrase)
  // Using @noble/hashes ensures we don't need WebCrypto complexity or Buffer
  const ikm = await pbkdf2Async(sha256, passwordBytes, salt, {
    c: 600_000,
    dkLen: 32,
  });

  // 2. HKDF-Expand (Simplified)
  const info = enc.encode("root-key");
  const rootKey = hmac(sha256, ikm, info); // Use HMAC as a simple expander

  // 3. Mnemonic Generation (using @scure/bip39 - No Buffer needed!)
  const mnemonic = bip39.entropyToMnemonic(rootKey, wordlist);

  // 4. Private Key
  // Note: secp.utils.hashToPrivateKey is deprecated in newer noble-secp versions.
  // We can use the rootKey directly if it's 32 bytes and within curve range.
  const privateKeyHex = bytesToHex(rootKey);

  return { mnemonic, privateKeyHex };
};
