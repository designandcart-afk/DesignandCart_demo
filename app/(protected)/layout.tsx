// app/(protected)/layout.tsx
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If you want different chrome for protected pages, add it here.
  return <>{children}</>;
}
