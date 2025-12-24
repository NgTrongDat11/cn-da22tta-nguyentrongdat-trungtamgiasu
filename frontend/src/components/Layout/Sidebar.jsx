/**
 * LAYOUT COMPONENTS - SIDEBAR
 */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Menu cho từng role
  const menuItems = {
    HocVien: [
      { path: '/student', icon: '📊', label: 'Dashboard' },
      { path: '/student/classes', icon: '📚', label: 'Tìm Lớp Học' },
      { path: '/student/schedule', icon: '📅', label: 'Lịch Học' },
      { path: '/student/registrations', icon: '📝', label: 'Đăng Ký Của Tôi' },
      { path: '/student/ratings', icon: '⭐', label: 'Đánh Giá GS' },
      { path: '/student/profile', icon: '👤', label: 'Hồ Sơ' },
    ],
    GiaSu: [
      { path: '/tutor', icon: '📊', label: 'Dashboard' },
      { path: '/tutor/classes', icon: '📚', label: 'Lớp Của Tôi' },
      { path: '/tutor/schedule', icon: '📅', label: 'Lịch Dạy' },
      { path: '/tutor/create-class', icon: '➕', label: 'Tạo Lớp Mới' },
      { path: '/tutor/registrations', icon: '📝', label: 'Đơn Đăng Ký' },
      { path: '/tutor/ratings', icon: '⭐', label: 'Đánh Giá HV' },
      { path: '/tutor/profile', icon: '👤', label: 'Hồ Sơ' },
    ],
    Admin: [
      { path: '/admin', icon: '📊', label: 'Dashboard' },
      { path: '/admin/users', icon: '👥', label: 'Quản Lý Tài Khoản' },
      { path: '/admin/classes', icon: '📚', label: 'Quản Lý Lớp Học' },
      { path: '/admin/subjects', icon: '📖', label: 'Môn Học' },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
