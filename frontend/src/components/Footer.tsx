import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/poll/")) return null;

  return (
  <footer className="border-t border-border/60 py-12 px-4">
    <div className="container mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        {/* Brand + meaning */}
        <div className="md:col-span-2">
          <p className="text-lg font-medium mb-2" style={{ fontFamily: '"Exposure Trial", "Apercu", system-ui, sans-serif' }}>
            Pejla
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Swedish verb — to sound out, to gauge, to get a feel for something.
            Pejla is a tool for collecting clear, quantified design feedback.
            Share options, collect votes, make better decisions.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <a href="https://github.com/daniellauding" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          <a href="https://daniellauding.se" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">daniellauding.se</a>
          <a href="mailto:daniel@lauding.se" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>Made by Daniel Lauding · Technigo 2026</p>
        <p>Built with React, Node.js, MongoDB</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
