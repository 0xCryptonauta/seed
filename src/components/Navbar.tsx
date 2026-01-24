export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-16 p-6">
          <div style={{ position: "fixed", left: "20px", top: "20px" }}>
            <img src="/vite.svg" alt="Vite" className="w-6 h-6" />
          </div>
          <div>
            <span>Deterministic Mnemonic Generator</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
