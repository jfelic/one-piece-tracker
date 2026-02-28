import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-semibold">One Piece Tracker</span>
        <ModeToggle />
      </div>
    </header>
  );
}
