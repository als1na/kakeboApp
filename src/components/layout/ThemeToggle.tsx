
'use client';

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before allowing interaction that depends on `document`.
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    if (!mounted) return; // Should not happen if button is disabled, but as a safeguard
    document.documentElement.classList.toggle('dark');
    // In a real app with a theme provider (e.g., next-themes),
    // you would call its function here instead of directly manipulating the classList.
  };

  if (!mounted) {
    // Render a placeholder or a disabled version to avoid hydration issues
    // and prevent interaction before the component is fully client-side ready.
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        {/* Moon icon is styled with dark: variants, so it would be hidden by default.
            We can include it for layout consistency if desired, or omit it. */}
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
