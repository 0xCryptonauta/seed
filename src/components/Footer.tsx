export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-12 p-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InBytes
          </div>
        </div>
      </div>
    </footer>
  );
}
