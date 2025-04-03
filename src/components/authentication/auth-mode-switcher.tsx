/**
 * AuthModeSwitcher: The Authentication Mode Toggle
 * ---------------------------------------------
 * Think of this as a toggle switch that:
 * 
 * - Manages Mode Switching:
 *   • Toggles between signup and signin views
 *   • Maintains consistent state between parent and child
 *   • Provides clear user navigation
 * 
 * - Handles UI Presentation:
 *   • Shows contextual text based on current mode
 *   • Provides clear call-to-action buttons
 *   • Maintains consistent styling
 */
// Define component props with mode management functions
interface AuthModeSwitcherProps {
    currentTab: string              // Current authentication mode
    onTabChange?: (tab: string) => void  // Optional parent callback
    setCurrentTab: (tab: string) => void // Local state updater
}


export function AuthModeSwitcher({ currentTab, onTabChange, setCurrentTab }: AuthModeSwitcherProps) {
    return (
        // Container with consistent text styling
        <p className="text-center text-sm text-muted-foreground mt-2">
            {/* Conditional rendering based on current mode */}
            {currentTab === "signup" ? (
                <>
                    Already have an account?{" "}
                    <button
                        onClick={() => {
                            setCurrentTab("signin")     // Update local state
                            onTabChange?.("signin")     // Notify parent if callback provided
                        }}
                        className="text-primary hover:underline"
                    >
                        Log in
                    </button>
                </>
            ) : (
                <>
                    Don&apos;t have an account?{" "}
                    <button
                        onClick={() => {
                            setCurrentTab("signup")     // Update local state
                            onTabChange?.("signup")     // Notify parent if callback provided
                        }}
                        className="text-primary hover:underline"
                    >
                        Sign up
                    </button>
                </>
            )}
        </p>
    )
} 