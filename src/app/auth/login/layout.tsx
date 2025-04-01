import type { Metadata } from "next";
import React from "react";

/**
 * Metadata for the login layout.
 * Sets the page title and description for SEO purposes.
 */
export const metadata: Metadata = {
  title: "Authentication - DigiChama", // The title displayed in the browser tab.
  description: "Authentication forms built using the components.", // A brief description for SEO.
};

/**
 * LoginLayout component.
 * Wraps the authentication-related pages with a layout.
 *
 * @param children - The child components to be rendered within the layout.
 * @returns The rendered child components.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode; // React nodes passed as children to the layout.
}) {
  return (
    <div className="auth-layout">
      {/* Render the child components */}
      {children}
    </div>
  );
}
