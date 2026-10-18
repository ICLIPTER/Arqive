import { Box, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { Link, useOutletContext } from "react-router";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/community", label: "Community" },
  { href: "/enterprise", label: "Enterprise" },
];

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } =
    useOutletContext<AuthContext>();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = async () => {
    setMenuOpen(false);

    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Puter sign out failed: ${e}`);
      }
      return;
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`Puter sign in failed: ${e}`);
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <Link to="/" className="brand" aria-label="Arqive home">
            <Box className="logo" />
            <span className="name">Arqive</span>
          </Link>

          <ul className="links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link to={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi ${userName}` : "Signed in"}
              </span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log in
              </Button>
              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}

          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} to={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
