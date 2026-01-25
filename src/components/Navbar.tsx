import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 p-6">
          <div>
            <img src="/vite.svg" alt="Vite" className="w-6 h-6" />
          </div>
          <div>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Deterministic Mnemonic Generator
            </span>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
