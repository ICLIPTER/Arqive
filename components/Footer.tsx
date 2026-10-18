import { Box } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-row">
            <Box size={20} className="logo" />
            <span className="name">Arqive</span>
          </div>

          <p className="tagline">
            The AI-first design environment for modern architectural teams.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/product">Product</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/community">Community</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/enterprise">Enterprise</Link>
            <Link to="/community">Community</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#faq">FAQ</a>
            <a href="https://docs.puter.com" target="_blank" rel="noreferrer">
              Docs
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Arqive. All rights reserved.</span>
        <span>
          Powered by{" "}
          <a href="https://puter.com" target="_blank" rel="noreferrer">
            Puter
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
