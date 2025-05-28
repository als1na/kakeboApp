import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="KakeboApp Logo"
      {...props}
    >
      {/* Background square with rounded corners */}
      <rect width="100" height="100" rx="20" fill="hsl(var(--primary))" />

      {/* Stylized "K" using lines - thicker for better visibility */}
      {/* Vertical bar of K */}
      <line
        x1="35"
        y1="25"
        x2="35"
        y2="75"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Upper diagonal of K */}
      <line
        x1="35"
        y1="50"
        x2="65"
        y2="25"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Lower diagonal of K */}
      <line
        x1="35"
        y1="50"
        x2="65"
        y2="75"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Small accent dot */}
      <circle cx="75" cy="75" r="6" fill="hsl(var(--accent))" />
    </svg>
  );
}
