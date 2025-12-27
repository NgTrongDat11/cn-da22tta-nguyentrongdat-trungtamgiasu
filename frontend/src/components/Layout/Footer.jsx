/**
 * LAYOUT COMPONENTS - FOOTER
 */
import './Layout.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎓</span>
              <div className="footer-logo-text">
                <span className="footer-brand-name">TutorViet</span>
                <span className="footer-tagline">Kết nối tri thức - Nâng tầm tương lai</span>
              </div>
            </div>
            <p className="footer-description">
              Nền tảng kết nối gia sư chất lượng hàng đầu Việt Nam. 
              Chúng tôi cam kết mang đến những gia sư tốt nhất cho học viên.
            </p>
          </div>

          {/* Contact Info Section */}
          <div className="footer-contact-section">
            <h4 className="footer-section-title">Thông tin liên hệ</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-info">
                  <span className="contact-label">Địa chỉ:</span>
                  <span className="contact-value">126 Nguyễn Thiện Thành, Phường Trà Vinh, Tỉnh Vĩnh Long</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-info">
                  <span className="contact-label">Hotline:</span>
                  <a href="tel:0782929512" className="contact-value contact-link">0782929512</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-info">
                  <span className="contact-label">Email:</span>
                  <a href="mailto:Nguyentrongdat10244@gmail.com" className="contact-value contact-link">Nguyentrongdat10244@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            Nguyễn Trọng Đạt - 110122217 | Đồ Án Chuyên Ngành | © 2025 TutorViet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
