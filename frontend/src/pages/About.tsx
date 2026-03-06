import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";

const About = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      {/* About the product */}
      <section className="mb-16">
        <h1 className="text-3xl md:text-5xl tracking-tight mb-6">About Pejla</h1>
        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
          <p>
            Pejla helps designers and creative teams collect clear, quantified feedback on their work.
            Instead of vague Slack comments like "I prefer the first one," you share design options
            via images, Figma embeds, or video — and stakeholders vote with one click.
          </p>
          <p>
            It solves the problem of design-by-committee and endless debates by turning subjective
            opinions into actionable data. Client reviews, iteration rounds, design crits — all
            resolved with a single link.
          </p>
          <p>
            Built for designers, developers, and vibe coders — anyone who makes things and needs
            a second opinion before shipping.
          </p>
        </div>
      </section>

      {/* About the creator */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl tracking-tight mb-6">Made by</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <span className="text-foreground font-medium">Daniel Lauding</span> — Design Engineer
            and Product Designer with 15+ years in digital product development. Based in Sweden.
          </p>
          <p>
            Previously designed products at Spotify, Swedbank, and Länsförsäkringar.
            Co-founded Asteria (400,000+ users). Founded Instinctly, a design consultancy, in 2007.
          </p>
          <p>
            Pejla is a final project for the Technigo frontend developer bootcamp — built as a
            full-stack app with React, Node.js, Express, and MongoDB.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm">
          <a href="https://daniellauding.se" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
            daniellauding.se
          </a>
          <a href="https://linkedin.com/in/daniellauding" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com/daniellauding" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
            GitHub
          </a>
          <a href="mailto:daniel@lauding.se" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
            daniel@lauding.se
          </a>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl tracking-tight mb-6">Tech stack</h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm text-muted-foreground">
          <p><span className="text-foreground">Frontend</span> — React, TypeScript, Tailwind CSS, shadcn/ui</p>
          <p><span className="text-foreground">Backend</span> — Node.js, Express, MongoDB, Mongoose</p>
          <p><span className="text-foreground">Auth</span> — bcrypt, JWT-style sessions</p>
          <p><span className="text-foreground">Media</span> — Cloudinary</p>
          <p><span className="text-foreground">Hosting</span> — Netlify + Render</p>
          <p><span className="text-foreground">Design</span> — Figma, Storybook</p>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="border-t border-border/60 pt-12 text-center">
          <h2 className="text-2xl tracking-tight mb-3">Try it out</h2>
          <p className="text-muted-foreground mb-6">Create your first poll in 30 seconds.</p>
          <Button size="lg" onClick={() => setShowAuth(true)}>
            Get started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </section>
      )}
    </div>
  );
};

export default About;
