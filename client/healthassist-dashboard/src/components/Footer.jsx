/**
 * 🔹 Footer component for HealthAssist Dashboard
 * Displays a small centered text
 */
export default function Footer() {
  return (
    <footer
      className="
        py-6                  /* vertical padding */
        text-center           /* center the text */
        text-sm               /* small font size */
        opacity-70            /* slightly transparent */
        mt-8                  /* margin-top spacing */
        transition-colors     /* smooth color transitions for dark/light mode */
      ">
      Made with 💙 by Jayesh
    </footer>
  );
}
