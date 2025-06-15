"use client";

// This is a client component
// See: https://nextjs.org/docs/app/building-your-application/rendering/client-components

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
