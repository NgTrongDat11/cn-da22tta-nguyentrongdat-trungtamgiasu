/**
 * ADMIN - QUẢN LÝ LỚP HỌC
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, classAPI, subjectAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Pagination from '../../components/Pagination/Pagination';
import apiClient from '../../api/client';
import '../Dashboard/Dashboard.css';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filter, setFilter] = useState({ trangThai: '' });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Giá trị thực sự dùng để gọi API
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignData, setAssignData] = useState({ maGiaSu: '' });
  const [classFormData, setClassFormData] = useState({
    maMon: '',
    tenLop: '',
    hocPhi: '',
    moTa: '',
    hinhThuc: 'Offline',
    soBuoiDuKien: '',
    lichHocs: [], // Array of schedule objects
  });

  useEffect(() => {
    loadData();
    loadExpiringSoon();
  }, [filter, searchQuery, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesResponse, tutorsResponse, subjectsData] = await Promise.all([
        adminAPI.getClasses({ 
          ...filter,
          search: searchQuery || undefined,
          page: pagination.page, 
          limit: pagination.limit 
        }),
        apiClient.get('/gia-su?limit=1000').then(res => res.data.data),
        subjectAPI.getAllSubjects(),
      ]);
      
      // Handle paginated response
      const classList = classesResponse?.data || [];
      setClasses(classList);
      setPagination(prev => ({
        ...prev,
        total: classesResponse?.pagination?.total || 0,
        totalPages: classesResponse?.pagination?.totalPages || 0
      }));
      
      const tutorsData = Array.isArray(tutorsResponse)
        ? tutorsResponse
        : (tutorsResponse?.items || tutorsResponse?.data || []);
        
      setTutors(tutorsData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const loadExpiringSoon = async () => {
    try {
      const data = await adminAPI.getExpiringSoon(7);
      setExpiringSoon(data);
    } catch (err) {
      console.error('Failed to load expiring classes:', err);
    }
  };

  const handleAssignTutor = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.assignTutor(selectedClass.maLop, assignData);
      toast.success('Gán gia sư thành công!');
      setShowAssignModal(false);
      setSelectedClass(null);
      setAssignData({ maGiaSu: '' });
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gán gia sư');
    }
  };

  const openAssignModal = (cls) => {
    setSelectedClass(cls);
    setAssignData({ maGiaSu: '' });
    setShowAssignModal(true);
  };

  const openCreateModal = () => {
    setSelectedClass(null);
    setClassFormData({
      maMon: '',
      tenLop: '',
      hocPhi: '',
      moTa: '',
      hinhThuc: 'Offline',
      soBuoiDuKien: '',
      lichHocs: [],
    });
    setShowClassModal(true);
  };

  const openEditModal = async (cls) => {
    setSelectedClass(cls);
    setShowClassModal(true);
    setModalLoading(true);

    try {
      // Luôn lấy chi tiết lớp để có đầy đủ lichHocs với thời gian chuẩn
      const detail = await classAPI.getClassDetail(cls.maLop);
      const target = detail || cls;

      setClassFormData({
        maMon: target.maMon,
        tenLop: target.tenLop,
        hocPhi: target.hocPhi,
        moTa: target.moTa || '',
        hinhThuc: target.hinhThuc,
        soBuoiDuKien: target.soBuoiDuKien || '',
        lichHocs: (target.lichHocs || []).map(lich => ({
          thu: lich.thu?.toString() || '',
          gioBatDau: formatTimeForInput(lich.gioBatDau),
          gioKetThuc: formatTimeForInput(lich.gioKetThuc),
          phongHoc: lich.phongHoc || '',
          linkHocOnline: lich.linkHocOnline || '',
        })),
      });
    } catch (error) {
      console.error('Failed to load class detail:', error);
      toast.error('Không thể tải chi tiết lớp, dùng dữ liệu hiện có');
      // Fallback to existing cls data
      setClassFormData({
        maMon: cls.maMon,
        tenLop: cls.tenLop,
        hocPhi: cls.hocPhi,
        moTa: cls.moTa || '',
        hinhThuc: cls.hinhThuc,
        soBuoiDuKien: cls.soBuoiDuKien || '',
        lichHocs: (cls.lichHocs || []).map(lich => ({
          thu: lich.thu?.toString() || '',
          gioBatDau: formatTimeForInput(lich.gioBatDau),
          gioKetThuc: formatTimeForInput(lich.gioKetThuc),
          phongHoc: lich.phongHoc || '',
          linkHocOnline: lich.linkHocOnline || '',
        })),
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT START ===');
    console.log('Form data:', classFormData);
    console.log('Selected class:', selectedClass);
    
    try {
      // Filter out incomplete schedules
      const validLichHocs = classFormData.lichHocs.filter(lich => 
        lich.thu && lich.gioBatDau && lich.gioKetThuc
      );

      // Build base payload
      const payload = {
        maMon: classFormData.maMon,
        tenLop: classFormData.tenLop,
        hocPhi: parseFloat(classFormData.hocPhi),
        moTa: classFormData.moTa,
        hinhThuc: classFormData.hinhThuc,
        soBuoiDuKien: classFormData.soBuoiDuKien ? parseInt(classFormData.soBuoiDuKien) : null,
        lichHocs: validLichHocs.map(lich => ({
          thu: parseInt(lich.thu),
          gioBatDau: lich.gioBatDau,
          gioKetThuc: lich.gioKetThuc,
          phongHoc: classFormData.hinhThuc === 'Offline' ? lich.phongHoc : null,
          linkHocOnline: classFormData.hinhThuc === 'Online' ? lich.linkHocOnline : null,
        })),
      };

      console.log('Payload to send:', payload);

      if (selectedClass) {
        console.log('→ UPDATING class:', selectedClass.maLop);
        const result = await classAPI.updateClass(selectedClass.maLop, payload);
        console.log('← Update response:', result);
        toast.success('Cập nhật lớp học thành công!');
      } else {
        console.log('→ CREATING new class');
        const result = await classAPI.createClass(payload);
        console.log('← Create response:', result);
        toast.success('Tạo lớp học thành công!');
      }

      console.log('Closing modal...');
      setShowClassModal(false);
      console.log('Reloading data...');
      await loadData();
      console.log('=== FORM SUBMIT SUCCESS ===');
    } catch (err) {
      console.error('=== FORM SUBMIT ERROR ===');
      console.error('Error:', err);
      console.error('Response:', err.response);
      toast.error(err.response?.data?.message || err.message || 'Không thể lưu lớp học');
    }
  };

  const handleDelete = async (cls) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lớp "${cls.tenLop}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) return;
    
    try {
      await adminAPI.deleteClass(cls.maLop);
      toast.success('Xóa lớp học thành công!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa lớp học');
    }
  };

  const handleRemoveTutor = async (cls) => {
    // Lấy gia sư từ hợp đồng: ưu tiên DangDay, fallback sang DaKetThuc
    const hopDongDangDay = cls.hopDongs?.find(hd => hd.trangThai === 'DangDay');
    const hopDongDaKetThuc = cls.hopDongs?.find(hd => hd.trangThai === 'DaKetThuc');
    const giaSu = hopDongDangDay?.giaSu || hopDongDaKetThuc?.giaSu;
    const tenGiaSu = giaSu?.hoTen || 'gia sư';
    
    if (!window.confirm(`Bạn có chắc muốn gỡ ${tenGiaSu} khỏi lớp "${cls.tenLop}"?\n\nSau khi gỡ, bạn có thể gán gia sư khác hoặc xóa lớp.`)) return;
    
    try {
      await adminAPI.removeTutor(cls.maLop);
      toast.success(`Đã gỡ ${tenGiaSu} khỏi lớp thành công!`);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gỡ gia sư');
    }
  };

  const handleFinishClass = async (cls) => {
    if (!window.confirm(`Xác nhận kết thúc lớp "${cls.tenLop}"?\n\nLớp sẽ chuyển sang trạng thái "Đã Kết Thúc" và không thể hoàn tác.`)) return;
    
    try {
      await adminAPI.finishClass(cls.maLop, {
        lyDoKetThuc: 'Hoàn thành khóa học'
      });
      toast.success('Đã kết thúc lớp học thành công!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể kết thúc lớp học');
    }
  };

  const handleCancelClass = async (cls) => {
    const lyDoHuy = window.prompt(`Nhập lý do hủy lớp "${cls.tenLop}":`);
    if (!lyDoHuy || lyDoHuy.trim() === '') {
      toast.warning('Vui lòng nhập lý do hủy lớp');
      return;
    }
    
    try {
      await adminAPI.cancelClass(cls.maLop, lyDoHuy.trim());
      toast.success('Đã hủy lớp học!');
      await loadData();
      await loadExpiringSoon();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy lớp học');
    }
  };

  const handleSelectClass = (maLop) => {
    setSelectedClasses(prev => 
      prev.includes(maLop) 
        ? prev.filter(id => id !== maLop)
        : [...prev, maLop]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === classes.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classes.map(cls => cls.maLop));
    }
  };

  const handleBulkFinish = async () => {
    if (selectedClasses.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một lớp');
      return;
    }

    const lyDoKetThuc = window.prompt(
      `Xác nhận kết thúc ${selectedClasses.length} lớp học?\n\nNhập lý do kết thúc:`
    );
    
    if (!lyDoKetThuc || lyDoKetThuc.trim() === '') {
      toast.warning('Vui lòng nhập lý do kết thúc');
      return;
    }

    try {
      await adminAPI.bulkFinishClasses(selectedClasses, lyDoKetThuc.trim());
      toast.success(`Đã kết thúc ${selectedClasses.length} lớp học thành công!`);
      setSelectedClasses([]);
      await loadData();
      await loadExpiringSoon();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể kết thúc các lớp học');
    }
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
          <h1>Quản Lý Lớp Học 📚</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            ➕ Tạo Lớp Học
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <select 
            value={filter.trangThai} 
            onChange={(e) => setFilter({...filter, trangThai: e.target.value})}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DangTuyen">Đang Tuyển</option>
            <option value="DangDay">Đang Dạy</option>
            <option value="KetThuc">Đã Kết Thúc</option>
            <option value="Huy">Đã Hủy</option>
          </select>

          <input
            type="text"
            placeholder="Tìm theo tên lớp..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchQuery(searchInput);
                setPagination(prev => ({ ...prev, page: 1 }));
              }
            }}
            className="filter-input"
          />
          <button 
            onClick={() => {
              setSearchQuery(searchInput);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'} Tìm kiếm
          </button>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className="alert alert-warning" style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{marginTop: 0, color: '#856404'}}>⚠️ Lớp Sắp Hết Hạn (7 ngày tới)</h3>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', fontSize: '0.9em'}}>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left', padding: '8px'}}>Tên Lớp</th>
                    <th style={{textAlign: 'left', padding: '8px'}}>Môn</th>
                    <th style={{textAlign: 'left', padding: '8px'}}>Gia Sư</th>
                    <th style={{textAlign: 'left', padding: '8px'}}>Ngày Kết Thúc</th>
                    <th style={{textAlign: 'center', padding: '8px'}}>Còn Lại</th>
                    <th style={{textAlign: 'center', padding: '8px'}}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringSoon.map(cls => (
                    <tr key={cls.maLop}>
                      <td style={{padding: '8px'}}><strong>{cls.tenLop}</strong></td>
                      <td style={{padding: '8px'}}>{cls.tenMon}</td>
                      <td style={{padding: '8px'}}>{cls.giaSu}</td>
                      <td style={{padding: '8px'}}>{new Date(cls.ngayKetThuc).toLocaleDateString('vi-VN')}</td>
                      <td style={{textAlign: 'center', padding: '8px'}}>
                        <span style={{
                          backgroundColor: cls.daysRemaining <= 2 ? '#dc3545' : '#ffc107',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {cls.daysRemaining} ngày
                        </span>
                      </td>
                      <td style={{textAlign: 'center', padding: '8px'}}>
                        <button 
                          onClick={() => {
                            const classObj = classes.find(c => c.maLop === cls.maLop);
                            if (classObj) handleFinishClass(classObj);
                          }}
                          className="btn btn-sm btn-success"
                          style={{fontSize: '0.85em'}}
                        >
                          🏁 Kết Thúc Ngay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Classes Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên Lớp</th>
                <th>Môn Học</th>
                <th>Gia Sư</th>
                <th>Hình Thức</th>
                <th>Học Phí</th>
                <th>Trạng Thái</th>
                <th>Số HS</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => {
                // Lấy gia sư từ hợp đồng: ưu tiên DangDay, fallback sang DaKetThuc nếu lớp đã kết thúc
                const hopDongDangDay = cls.hopDongs?.find(hd => hd.trangThai === 'DangDay');
                const hopDongDaKetThuc = cls.hopDongs?.find(hd => hd.trangThai === 'DaKetThuc');
                const giaSu = hopDongDangDay?.giaSu || hopDongDaKetThuc?.giaSu;
                const soHocVien = cls.soHocVien ?? cls._count?.dangKys ?? 0;
                
                return (
                  <tr key={cls.maLop}>
                    <td>
                      <strong>{cls.tenLop}</strong>
                      {cls.moTa && (
                        <div style={{fontSize: '0.85em', color: '#666', marginTop: '4px'}}>
                          {cls.moTa.length > 60 ? cls.moTa.substring(0, 60) + '...' : cls.moTa}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-info">{cls.monHoc?.tenMon || '-'}</span>
                    </td>
                    <td>
                      {giaSu ? (
                        <div>
                          <div>{giaSu.hoTen}</div>
                          <div style={{fontSize: '0.85em', color: '#666'}}>{giaSu.soDienThoai}</div>
                        </div>
                      ) : (
                        <span className="text-muted">Chưa có</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${cls.hinhThuc === 'Online' ? 'badge-primary' : 'badge-secondary'}`}>
                        {cls.hinhThuc === 'Online' ? '💻 Online' : '🏠 Offline'}
                      </span>
                    </td>
                    <td>{formatCurrency(cls.hocPhi)}</td>
                    <td>
                      <span className={`badge badge-${getStatusClass(cls.trangThai)}`}>
                        {cls.trangThai}
                      </span>
                    </td>
                    <td>
                      <strong>{soHocVien}/1</strong>
                      <div style={{fontSize: '0.85em', color: '#666'}}>Lớp 1-1</div>
                      {cls.soBuoiDuKien && (
                        <div style={{fontSize: '0.85em', color: '#666'}}>
                          {cls.soBuoiDuKien} buổi
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => openEditModal(cls)}
                          className="btn btn-sm btn-secondary"
                          title="Sửa lớp học"
                        >
                          ✏️ Sửa
                        </button>
                        {/* Xóa: cho phép nếu Huy hoặc DangTuyen không có gia sư đang dạy */}
                        {(cls.trangThai === 'Huy' || (cls.trangThai === 'DangTuyen' && !giaSu)) && (
                          <button 
                            onClick={() => handleDelete(cls)}
                            className="btn btn-sm btn-danger"
                            title="Xóa lớp học"
                          >
                            🗑️ Xóa
                          </button>
                        )}
                        {/* Gỡ gia sư: cho phép nếu DangTuyen và có gia sư đang dạy */}
                        {giaSu && cls.trangThai === 'DangTuyen' && (
                          <button 
                            onClick={() => handleRemoveTutor(cls)}
                            className="btn btn-sm btn-warning"
                            title="Gỡ gia sư khỏi lớp"
                          >
                            🔓 Gỡ GS
                          </button>
                        )}
                        {/* Gán gia sư: cho phép nếu DangTuyen và chưa có gia sư */}
                        {!giaSu && cls.trangThai === 'DangTuyen' && (
                          <button 
                            onClick={() => openAssignModal(cls)}
                            className="btn btn-sm btn-primary"
                            title="Gán gia sư"
                          >
                            👨‍🏫 Gán
                          </button>
                        )}
                        {cls.trangThai === 'DangDay' && (
                          <button 
                            onClick={() => handleFinishClass(cls)}
                            className="btn btn-sm btn-warning"
                            title="Kết thúc lớp học"
                          >
                            🏁 Kết Thúc
                          </button>
                        )}
                        {cls.trangThai === 'DangTuyen' && (
                          <button 
                            onClick={() => handleCancelClass(cls)}
                            className="btn btn-sm btn-danger"
                            title="Hủy lớp học"
                          >
                            ✕ Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {classes.length === 0 && !loading && (
            <div className="empty-state">
              <p>Không có lớp học nào. Nhấn "Tạo Lớp Học" để tạo mới.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
          itemName="lớp học"
        />

        {/* Create/Edit Class Modal */}
        {showClassModal && (
          <div className="modal-overlay" onClick={() => setShowClassModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedClass ? 'Sửa Lớp Học' : 'Tạo Lớp Học Mới'}</h2>

              {modalLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu lớp học...</div>
              ) : (
              <form onSubmit={handleClassSubmit}>
                <div className="form-group">
                  <label>Môn Học *</label>
                  <select
                    required
                    value={classFormData.maMon}
                    onChange={(e) => setClassFormData({...classFormData, maMon: e.target.value})}
                    className="form-input"
                  >
                    <option value="">-- Chọn môn học --</option>
                    {subjects.map((mon) => (
                      <option key={mon.maMon} value={mon.maMon}>
                        {mon.tenMon} ({mon.capDo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tên Lớp *</label>
                  <input
                    type="text"
                    required
                    value={classFormData.tenLop}
                    onChange={(e) => setClassFormData({...classFormData, tenLop: e.target.value})}
                    className="form-input"
                    placeholder="VD: Lớp Toán 10 Nâng Cao"
                  />
                </div>

                <div className="form-group">
                  <label>Học Phí *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={classFormData.hocPhi}
                    onChange={(e) => setClassFormData({...classFormData, hocPhi: e.target.value})}
                    className="form-input"
                    placeholder="VD: 150000"
                  />
                </div>

                <div className="form-group">
                  <label>Hình Thức Học *</label>
                  <select
                    required
                    value={classFormData.hinhThuc}
                    onChange={(e) => setClassFormData({...classFormData, hinhThuc: e.target.value})}
                    className="form-input"
                  >
                    <option value="">-- Chọn hình thức --</option>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Số Buổi Dự Kiến</label>
                  <input
                    type="number"
                    min="1"
                    value={classFormData.soBuoiDuKien}
                    onChange={(e) => setClassFormData({...classFormData, soBuoiDuKien: e.target.value})}
                    className="form-input"
                    placeholder="VD: 20 (để trống nếu không xác định)"
                  />
                </div>

                <div className="form-group">
                  <label>Mô Tả</label>
                  <textarea
                    value={classFormData.moTa}
                    onChange={(e) => setClassFormData({...classFormData, moTa: e.target.value})}
                    className="form-input"
                    rows="4"
                    placeholder="Mô tả chi tiết về lớp học..."
                  />
                </div>

                {/* Schedule Section */}
                <div className="form-group">
                  <label>Lịch Học 📅</label>
                  <div style={{ marginBottom: '10px' }}>
                    {classFormData.lichHocs.map((lich, index) => (
                      <div key={index} style={{ 
                        border: '1px solid #ddd', 
                        padding: '15px', 
                        marginBottom: '10px', 
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <strong>Buổi học #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              const newLichHocs = classFormData.lichHocs.filter((_, i) => i !== index);
                              setClassFormData({...classFormData, lichHocs: newLichHocs});
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Xóa
                          </button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Thứ *</label>
                            <select
                              required
                              value={lich.thu}
                              onChange={(e) => {
                                const newLichHocs = [...classFormData.lichHocs];
                                newLichHocs[index].thu = e.target.value;
                                setClassFormData({...classFormData, lichHocs: newLichHocs});
                              }}
                              className="form-input"
                            >
                              <option value="">-- Chọn thứ --</option>
                              <option value="2">Thứ 2</option>
                              <option value="3">Thứ 3</option>
                              <option value="4">Thứ 4</option>
                              <option value="5">Thứ 5</option>
                              <option value="6">Thứ 6</option>
                              <option value="7">Thứ 7</option>
                              <option value="8">Chủ nhật</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Giờ Bắt Đầu *</label>
                            <input
                              type="time"
                              required
                              value={lich.gioBatDau}
                              onChange={(e) => {
                                const newLichHocs = [...classFormData.lichHocs];
                                newLichHocs[index].gioBatDau = e.target.value;
                                setClassFormData({...classFormData, lichHocs: newLichHocs});
                              }}
                              className="form-input"
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Giờ Kết Thúc *</label>
                            <input
                              type="time"
                              required
                              value={lich.gioKetThuc}
                              onChange={(e) => {
                                const newLichHocs = [...classFormData.lichHocs];
                                newLichHocs[index].gioKetThuc = e.target.value;
                                setClassFormData({...classFormData, lichHocs: newLichHocs});
                              }}
                              className="form-input"
                            />
                          </div>

                          {classFormData.hinhThuc === 'Offline' ? (
                            <div>
                              <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Phòng Học</label>
                              <input
                                type="text"
                                value={lich.phongHoc || ''}
                                onChange={(e) => {
                                  const newLichHocs = [...classFormData.lichHocs];
                                  newLichHocs[index].phongHoc = e.target.value;
                                  setClassFormData({...classFormData, lichHocs: newLichHocs});
                                }}
                                className="form-input"
                                placeholder="VD: Phòng 101, Tòa A"
                              />
                            </div>
                          ) : (
                            <div>
                              <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Link Học Online</label>
                              <input
                                type="url"
                                value={lich.linkHocOnline || ''}
                                onChange={(e) => {
                                  const newLichHocs = [...classFormData.lichHocs];
                                  newLichHocs[index].linkHocOnline = e.target.value;
                                  setClassFormData({...classFormData, lichHocs: newLichHocs});
                                }}
                                className="form-input"
                                placeholder="https://meet.google.com/..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setClassFormData({
                          ...classFormData,
                          lichHocs: [...classFormData.lichHocs, {
                            thu: '',
                            gioBatDau: '',
                            gioKetThuc: '',
                            phongHoc: '',
                            linkHocOnline: ''
                          }]
                        });
                      }}
                      className="btn btn-secondary"
                      style={{ width: '100%' }}
                    >
                      + Thêm Buổi Học
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowClassModal(false)} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedClass ? 'Cập Nhật' : 'Tạo Lớp'}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        )}

        {/* Assign Tutor Modal */}
        {showAssignModal && selectedClass && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Gán Gia Sư cho Lớp: {selectedClass.tenLop}</h2>
              <form onSubmit={handleAssignTutor}>
                <div className="form-group">
                  <label>Chọn Gia Sư *</label>
                  <select
                    required
                    value={assignData.maGiaSu}
                    onChange={(e) => setAssignData({...assignData, maGiaSu: e.target.value})}
                    className="form-input"
                  >
                    <option value="">-- Chọn gia sư --</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.maGiaSu} value={tutor.maGiaSu}>
                        {tutor.hoTen} - {tutor.chuyenMon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Gán Gia Sư
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

// Helper function to convert DateTime to HH:mm format for input[type="time"]
const formatTimeForInput = (datetimeString) => {
  if (!datetimeString) return '';
  try {
    const date = new Date(datetimeString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

const formatCurrency = (amount) => {
  if (!amount) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getStatusClass = (status) => {
  const map = {
    DangTuyen: 'warning',
    DangDay: 'success',
    KetThuc: 'secondary',
    Huy: 'danger',
  };
  return map[status] || 'default';
};

export default AdminClasses;
