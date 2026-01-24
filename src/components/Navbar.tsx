export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto" style={{ padding: "1rem" }}>
        <div className="flex justify-between items-center h-16 p-2">
          <div className="flex items-center">
            <img src="/vite.svg" alt="Vite" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
}
