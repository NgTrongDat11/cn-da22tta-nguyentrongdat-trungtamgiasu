/**
 * ADMIN - QUẢN LÝ TÀI KHOẢN
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Pagination from '../../components/Pagination/Pagination';
import '../Dashboard/Dashboard.css';

const AdminUsers = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', trangThai: '', search: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', matKhau: '', hoTen: '' });

  useEffect(() => {
    loadAccounts();
  }, [filter, pagination.page]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAccounts({ 
        ...filter, 
        page: pagination.page, 
        limit: pagination.limit 
      });
      // Handle paginated response
      setAccounts(response?.data || []);
      setPagination(prev => ({
        ...prev,
        total: response?.pagination?.total || 0,
        totalPages: response?.pagination?.totalPages || 0
      }));
    } catch (err) {
      console.error('Failed to load accounts:', err);
      toast.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      const newStatus = account.trangThai === 'Active' ? 'Locked' : 'Active';
      await adminAPI.updateAccountStatus(account.id || account.maTaiKhoan, newStatus);
      toast.success(`Đã ${newStatus === 'Active' ? 'mở khóa' : 'khóa'} tài khoản`);
      await loadAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDeleteAccount = async (account) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${account.email}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      await adminAPI.deleteAccount(account.id);
      toast.success('Xóa tài khoản thành công!');
      await loadAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa tài khoản');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAdmin(formData);
      toast.success('Tạo tài khoản Admin thành công!');
      setShowCreateModal(false);
      setFormData({ email: '', matKhau: '', hoTen: '' });
      await loadAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tạo tài khoản');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="page-header">
          <h1>Quản Lý Tài Khoản 👥</h1>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            ➕ Tạo Admin
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <select 
            value={filter.role} 
            onChange={(e) => setFilter({...filter, role: e.target.value})}
            className="filter-select"
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="GiaSu">Gia Sư</option>
            <option value="HocVien">Học Viên</option>
          </select>

          <select 
            value={filter.trangThai} 
            onChange={(e) => setFilter({...filter, trangThai: e.target.value})}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Locked">Bị khóa</option>
          </select>

          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
            className="filter-input"
          />
        </div>

        {/* Accounts Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Họ Tên</th>
                <th>Số Điện Thoại</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts && accounts.length > 0 && accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.email}</td>
                  <td>{acc.giaSu?.hoTen || acc.hocVien?.hoTen || '-'}</td>
                  <td>{acc.giaSu?.soDienThoai || acc.hocVien?.soDienThoai || '-'}</td>
                  <td>
                    <span className={`badge badge-${acc.role.toLowerCase()}`}>
                      {acc.role === 'HocVien' ? '🎓 Học Viên' : 
                       acc.role === 'GiaSu' ? '👨‍🏫 Gia Sư' : 
                       '⚙️ Admin'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${acc.trangThai === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {acc.trangThai === 'Active' ? '✓ Hoạt động' : '✗ Khóa'}
                    </span>
                  </td>
                  <td>{new Date(acc.ngayTao || acc.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => handleToggleStatus(acc)}
                        className={`btn btn-sm ${acc.trangThai === 'Active' ? 'btn-danger' : 'btn-success'}`}
                        disabled={acc.role === 'Admin'}
                        title={acc.role === 'Admin' ? 'Không thể khóa tài khoản Admin' : ''}
                      >
                        {acc.trangThai === 'Active' ? '🔒 Khóa' : '🔓 Mở'}
                      </button>
                      <button 
                        onClick={() => handleDeleteAccount(acc)}
                        className="btn btn-sm btn-danger"
                        disabled={acc.role === 'Admin'}
                        title={acc.role === 'Admin' ? 'Không thể xóa tài khoản Admin' : 'Xóa tài khoản'}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!accounts || accounts.length === 0) && !loading && (
            <div className="empty-state">
              <p>Không tìm thấy tài khoản nào.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
          itemName="tài khoản"
        />

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Tạo Tài Khoản Admin</h2>
              <form onSubmit={handleCreateAdmin}>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.matKhau}
                    onChange={(e) => setFormData({...formData, matKhau: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Họ Tên</label>
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({...formData, hoTen: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Tạo Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
