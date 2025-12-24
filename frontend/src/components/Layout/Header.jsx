/**
 * LAYOUT COMPONENTS - HEADER
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    if (user) {
      e.preventDefault();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={handleLogoClick}>
          <div className="logo-wrapper">
            <img src="/logo.svg" alt="TutorViet Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-brand">TutorViet</span>
              <span className="logo-tagline">Kết nối tri thức</span>
            </div>
          </div>
        </Link>
        
        <nav className="header-nav">
          {user && (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {(user.hoTen || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.hoTen || user.email}</span>
                  <span className="user-role">
                    {user.role === 'HocVien' ? '🎓 Học Viên' : 
                     user.role === 'GiaSu' ? '👨‍🏫 Gia Sư' : 
                     '⚙️ Admin'}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Đăng Xuất
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
