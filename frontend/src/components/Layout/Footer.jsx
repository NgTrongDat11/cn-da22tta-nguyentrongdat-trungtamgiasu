/**
 * LAYOUT COMPONENTS - FOOTER
 */
import './Layout.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} TutorViet. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
