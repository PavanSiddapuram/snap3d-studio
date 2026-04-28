import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold tracking-tight">Snap3D</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            AI-powered 3D model generation and a free toolbox for makers.
          </p>
        </div>
        <FooterCol
          title="Product"
          items={[
            { to: "/generate/image", label: "Image to 3D" },
            { to: "/generate/text", label: "Text to 3D" },
            { to: "/tools", label: "All Tools" },
            { to: "/pricing", label: "Pricing" },
          ]}
        />
        <FooterCol
          title="Account"
          items={[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/settings", label: "Settings" },
          ]}
        />
        <FooterCol
          title="Resources"
          items={[
            { to: "/", label: "Docs" },
            { to: "/", label: "Changelog" },
            { to: "/", label: "Support" },
          ]}
        />
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Snap3D. All rights reserved.</p>
          <p>Crafted for makers · STL · GLB · OBJ</p>
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
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-foreground/80 hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
