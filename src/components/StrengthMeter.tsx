import { useState, useEffect, type JSX } from "react";
import { cn } from "@/lib/utils";

interface StrengthMeterProps {
  passphrase: string;
  className?: string;
}

export default function StrengthMeter({
  passphrase,
  className,
}: StrengthMeterProps): JSX.Element {
  const [strength, setStrength] = useState<number>(0);
  const [entropyBits, setEntropyBits] = useState<number>(0);
  const [strengthLevel, setStrengthLevel] = useState<string>("none");

  useEffect(() => {
    if (!passphrase) {
      setStrength(0);
      setEntropyBits(0);
      setStrengthLevel("none");
      return;
    }

    // Calculate entropy based on character diversity and length
    const calculateEntropy = (): number => {
      const length = passphrase.length;
      if (length === 0) return 0;

      // Character diversity analysis
      let charSetSize = 0;
      const hasLowercase = /[a-z]/.test(passphrase);
      const hasUppercase = /[A-Z]/.test(passphrase);
      const hasNumbers = /[0-9]/.test(passphrase);
      const hasSpecial = /[^a-zA-Z0-9]/.test(passphrase);

      if (hasLowercase) charSetSize += 26;
      if (hasUppercase) charSetSize += 26;
      if (hasNumbers) charSetSize += 10;
      if (hasSpecial) charSetSize += 32; // Common special characters

      // Minimum character set size is 10 (digits only)
      charSetSize = Math.max(charSetSize, 10);

      // Calculate entropy in bits: log2(charSetSize^length) = length * log2(charSetSize)
      const entropy = length * Math.log2(charSetSize);

      return entropy;
    };

    const entropy = calculateEntropy();
    setEntropyBits(entropy);

    // Normalize to 0-100 scale for visual representation based on strength levels
    let normalizedStrength;
    if (entropy < 1024) {
      normalizedStrength = Math.min(20, Math.floor(entropy / 51.2)); // 0-20% for very weak
    } else if (entropy < 2048) {
      normalizedStrength =
        20 + Math.min(20, Math.floor((entropy - 1024) / 51.2)); // 20-40% for weak
    } else if (entropy < 4086) {
      normalizedStrength =
        40 + Math.min(20, Math.floor((entropy - 2048) / 101.9)); // 40-60% for moderate
    } else if (entropy < 8192) {
      normalizedStrength =
        60 + Math.min(20, Math.floor((entropy - 4086) / 205.3)); // 60-80% for strong
    } else {
      normalizedStrength =
        80 + Math.min(20, Math.floor((entropy - 8192) / 205.3)); // 80-100% for very strong
    }
    setStrength(normalizedStrength);

    // Determine strength level
    if (entropy < 1024) {
      setStrengthLevel("very weak");
    } else if (entropy < 2048) {
      setStrengthLevel("weak");
    } else if (entropy < 4086) {
      setStrengthLevel("moderate");
    } else if (entropy < 8192) {
      setStrengthLevel("strong");
    } else {
      setStrengthLevel("very strong");
    }
  }, [passphrase]);

  const getStrengthColor = (): string => {
    if (strengthLevel === "none") return "bg-gray-200";
    if (strengthLevel === "very weak") return "bg-red-500";
    if (strengthLevel === "weak") return "bg-orange-500";
    if (strengthLevel === "moderate") return "bg-yellow-500";
    if (strengthLevel === "strong") return "bg-green-500";
    return "bg-green-600"; // very strong
  };

  const getStrengthText = (): string => {
    if (strengthLevel === "none") return "No passphrase";
    return `${strengthLevel} (${entropyBits.toFixed(1)} bits)`;
  };

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Passphrase Strength
        </span>
        <span className="text-sm font-medium">{getStrengthText()}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>

      {strengthLevel !== "none" && (
        <div className="mt-2 text-xs text-muted-foreground flex justify-between">
          <span>Very Weak</span>
          <span>Weak</span>
          <span>Moderate</span>
          <span>Strong</span>
          <span>Very Strong</span>
        </div>
      )}
    </div>
  );
}
