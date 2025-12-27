/**
 * ADMIN - QUẢN LÝ MÔN HỌC
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { subjectAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Pagination from '../../components/Pagination/Pagination';
import '../Dashboard/Dashboard.css';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ tenMon: '', moTa: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Giá trị thực sự dùng để gọi API

  useEffect(() => {
    loadSubjects();
  }, [pagination.page, searchQuery]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectAPI.getSubjects({ 
        page: pagination.page, 
        limit: pagination.limit,
        search: searchQuery || undefined 
      });
      const subjectList = Array.isArray(res) ? res : (res?.data || []);
      setSubjects(subjectList);
      const pag = res?.pagination || {};
      setPagination(prev => ({
        ...prev,
        page: pag.page ?? prev.page,
        limit: pag.limit ?? prev.limit,
        total: pag.total ?? subjectList.length ?? 0,
        totalPages:
          pag.totalPages ||
          Math.ceil(
            (pag.total ?? subjectList.length ?? 0) /
            (pag.limit || prev.limit || Math.max(subjectList.length, 1))
          )
      }));
    } catch (err) {
      console.error('Failed to load subjects:', err);
      toast.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectAPI.updateSubject(editingSubject.maMon, formData);
        toast.success('Cập nhật môn học thành công!');
      } else {
        await subjectAPI.createSubject(formData);
        toast.success('Thêm môn học thành công!');
      }
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ tenMon: '', moTa: '' });
      await loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể lưu môn học');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({ tenMon: subject.tenMon, moTa: subject.moTa || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa môn học này?')) return;
    try {
      await subjectAPI.deleteSubject(id);
      toast.success('Xóa môn học thành công!');
      await loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa môn học');
    }
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ tenMon: '', moTa: '' });
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Only show full loading screen on initial load
  if (initialLoading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="page-header">
          <h1>Quản Lý Môn Học 📖</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            ➕ Thêm Môn Học
          </button>
        </div>

        {/* Search Bar */}
        <div className="filter-section" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Tìm kiếm môn học..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="form-input"
            style={{ maxWidth: '400px' }}
          />
          <button 
            onClick={handleSearch}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'} Tìm kiếm
          </button>
        </div>

        {/* Subjects Grid */}
        <div className="grid-3">
          {subjects.map((subject) => (
            <div key={subject.maMon} className="card">
              <div className="card-header">
                <h3>{subject.tenMon}</h3>
                <span className="badge">{subject.soLopHoc || 0} lớp</span>
              </div>
              <div className="card-body">
                <p>{subject.moTa || 'Không có mô tả'}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(subject)} className="btn btn-sm btn-secondary">
                  ✏️ Sửa
                </button>
                <button 
                  onClick={() => handleDelete(subject.maMon)} 
                  className="btn btn-sm btn-danger"
                  disabled={subject.soLopHoc > 0}
                  title={subject.soLopHoc > 0 ? 'Không thể xóa môn học đang có lớp học' : 'Xóa môn học'}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="empty-state">
            <p>Chưa có môn học nào. Nhấn "Thêm Môn Học" để tạo mới.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
          itemName="môn học"
        />

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingSubject ? 'Sửa Môn Học' : 'Thêm Môn Học'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên Môn Học *</label>
                  <input
                    type="text"
                    required
                    value={formData.tenMon}
                    onChange={(e) => setFormData({...formData, tenMon: e.target.value})}
                    className="form-input"
                    placeholder="Ví dụ: Toán 12, Tiếng Anh IELTS..."
                  />
                </div>
                <div className="form-group">
                  <label>Mô Tả</label>
                  <textarea
                    value={formData.moTa}
                    onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                    className="form-input"
                    rows={4}
                    placeholder="Mô tả ngắn về môn học..."
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSubject ? 'Cập Nhật' : 'Thêm'}
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

export default AdminSubjects;
