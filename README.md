# Deterministic Wallet Generator

A secure, browser-based cryptographic wallet generator that creates deterministic BIP-39 mnemonics and private keys from user-provided passphrases.

## Overview

This application allows users to generate cryptographic wallets deterministically from a secret passphrase. The same passphrase will always produce the same mnemonic and private key, making it easy to recover wallets without needing to store seed phrases.

## Features

- **Deterministic Generation**: Same passphrase → same wallet
- **BIP-39 Compliant**: Uses standard BIP-39 mnemonic generation
- **Secure Key Derivation**: Uses PBKDF2 with 600,000 iterations for passphrase hardening
- **Browser-Based**: No server-side processing, all computation happens client-side
- **Modern Stack**: Built with React 19, TypeScript, Vite, and Tailwind CSS

## Technical Details

### Cryptographic Process

1. **Passphrase Normalization**: Input is normalized using NFKD Unicode normalization
2. **Key Strengthening**: PBKDF2 with SHA-256, 600,000 iterations
3. **Key Expansion**: HMAC-based key derivation
4. **Mnemonic Generation**: BIP-39 entropy-to-mnemonic conversion
5. **Private Key Extraction**: 32-byte private key in hex format

### Security Considerations

- All cryptographic operations use audited libraries:
  - `@noble/hashes` for PBKDF2, HMAC, and SHA-256
  - `@scure/bip39` for BIP-39 mnemonic generation
- No sensitive data is transmitted to servers
- Uses modern cryptographic primitives with appropriate parameters

## Usage

1. Enter a strong, unique passphrase
2. Check the acknowledgment box
3. Click "Generate"
4. Store your generated mnemonic and private key securely

⚠️ **Important**: Anyone with your passphrase can regenerate your wallet. Keep it secret and secure!

## Development

## Project Structure

```
src/
├── components/       # React components
│   ├── WalletGenerator0.tsx  # Main wallet generator component
│   └── Navbar.tsx     # Navigation component
├── lib/              # Core logic
│   └── deriveFromPassphrase.ts  # Cryptographic derivation
├── App.tsx           # Main application
└── main.tsx          # Entry point
```

## Dependencies

### Core Cryptographic Libraries

- `@noble/hashes`: Secure cryptographic hash functions
- `@scure/bip39`: BIP-39 mnemonic generation

### UI Framework

- React 19 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components

### Build Tools

- Vite (via rolldown-vite) for fast development
- ESLint for code quality
- TypeScript for type safety

## Security Notes

1. **Browser Storage**: This application does not store any sensitive data in browser storage
2. **Memory Safety**: Generated keys are kept in memory only during the session
3. **Deterministic Security**: The security of generated wallets depends entirely on the strength of your passphrase

## License

This project is private and not intended for public distribution.

## Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. The authors are not responsible for any loss of funds or data resulting from the use of this software.
