import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-24 noise">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
            />
            <span className="text-base font-semibold tracking-tight">Snap3D</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            AI-powered 3D model generation and a free toolbox for makers.
            Crafted for people who build.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[Twitter, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-9 rounded-full border border-border-subtle flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol
          title="Product"
          items={[
            { href: "/generate/image", label: "Image to 3D" },
            { href: "/generate/text", label: "Text to 3D" },
            { href: "/tools", label: "All Tools" },
            { href: "/pricing", label: "Pricing" },
          ]}
        />
        <FooterCol
          title="Account"
          items={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/settings", label: "Settings" },
          ]}
        />
        <FooterCol
          title="Resources"
          items={[
            { href: "/", label: "Docs" },
            { href: "/", label: "Changelog" },
            { href: "/", label: "Support" },
          ]}
        />
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Snap3D. All rights reserved.</p>
          <p className="font-mono">STL · GLB · OBJ · 3MF</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              href={i.href}
              className="text-sm text-foreground/75 hover:text-foreground transition-colors"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
