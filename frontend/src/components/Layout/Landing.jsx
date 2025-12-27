/**
 * LANDING PAGE
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const roleMap = {
        Admin: '/admin',
        GiaSu: '/tutor',
        HocVien: '/student',
      };
      navigate(roleMap[user?.role] || '/');
    } else {
      navigate('/register/student');
    }
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container">
          <div className="landing-logo">
            <img src="/logo.svg" alt="TutorViet" className="landing-logo-img" />
            <div className="landing-logo-text">
              <span className="landing-brand">TutorViet</span>
              <span className="landing-tagline">Kết nối tri thức</span>
            </div>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <Link to={`/${user?.role === 'Admin' ? 'admin' : user?.role === 'GiaSu' ? 'tutor' : 'student'}`} className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline">Đăng Nhập</Link>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1>Nền Tảng Kết Nối Gia Sư & Học Viên Hàng Đầu</h1>
          <p>Tìm gia sư giỏi, học tập hiệu quả, an toàn và tin cậy tại TutorViet</p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
              Bắt Đầu Ngay
            </button>
            <Link to="/register/tutor" className="btn btn-outline btn-lg">
              Trở Thành Gia Sư
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Tại Sao Chọn Chúng Tôi?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Gia Sư Chất Lượng</h3>
              <p>Đội ngũ gia sư được xác minh và có kinh nghiệm</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>Đa Dạng Môn Học</h3>
              <p>Từ tiểu học đến đại học, đầy đủ các môn học</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🕐</div>
              <h3>Linh Hoạt Thời Gian</h3>
              <p>Sắp xếp lịch học phù hợp với bạn</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Giá Cả Hợp Lý</h3>
              <p>Chi phí hợp lý, chất lượng đảm bảo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Sẵn Sàng Bắt Đầu?</h2>
          <p>Tham gia ngay hôm nay để tìm gia sư phù hợp</p>
          <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
            Đăng Ký Ngay
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="landing-footer-content">
            {/* Brand Section */}
            <div className="landing-footer-brand">
              <div className="landing-footer-logo">
                <span className="landing-footer-icon">🎓</span>
                <div className="landing-footer-logo-text">
                  <span className="landing-footer-brand-name">TutorViet</span>
                  <span className="landing-footer-tagline">Kết nối tri thức - Nâng tầm tương lai</span>
                </div>
              </div>
              <p className="landing-footer-description">
                Nền tảng kết nối gia sư chất lượng hàng đầu Việt Nam. 
                Chúng tôi cam kết mang đến những gia sư tốt nhất cho học viên.
              </p>
            </div>

            {/* Contact Info Section */}
            <div className="landing-footer-contact">
              <h4 className="landing-footer-title">Thông tin liên hệ</h4>
              <div className="landing-footer-contact-list">
                <div className="landing-footer-contact-item">
                  <span className="landing-contact-icon">📍</span>
                  <div className="landing-contact-info">
                    <span className="landing-contact-label">Địa chỉ:</span>
                    <span className="landing-contact-value">126 Nguyễn Thiện Thành, Phường Trà Vinh, Tỉnh Vĩnh Long</span>
                  </div>
                </div>
                <div className="landing-footer-contact-item">
                  <span className="landing-contact-icon">📞</span>
                  <div className="landing-contact-info">
                    <span className="landing-contact-label">Hotline:</span>
                    <a href="tel:0782929512" className="landing-contact-value landing-contact-link">0782929512</a>
                  </div>
                </div>
                <div className="landing-footer-contact-item">
                  <span className="landing-contact-icon">✉️</span>
                  <div className="landing-contact-info">
                    <span className="landing-contact-label">Email:</span>
                    <a href="mailto:Nguyentrongdat10244@gmail.com" className="landing-contact-value landing-contact-link">Nguyentrongdat10244@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="landing-footer-bottom">
            <div className="landing-footer-divider"></div>
            <p className="landing-footer-copyright">
              Nguyễn Trọng Đạt - 110122217 | Đồ Án Chuyên Ngành | © 2025 TutorViet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
