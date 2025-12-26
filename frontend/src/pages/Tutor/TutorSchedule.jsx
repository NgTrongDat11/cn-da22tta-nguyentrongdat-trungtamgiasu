/**
 * TUTOR - LỊCH DẠY
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { tutorAPI } from '../../api/services';
import { getDayName, getNextWeekdayDate, formatShortDate } from '../../utils/dateUtils';
import './Tutor.css';

const TutorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const contracts = await tutorAPI.getMyClasses({ limit: 1000 });
      
      // Extract all schedules from all classes
      const allSchedules = [];
      contracts.forEach(contract => {
        const cls = contract.lopHoc;
        // Filter: Chỉ hiển thị lịch của lớp đang hoạt động (không phải KetThuc hoặc Huy)
        if (cls && cls.lichHocs && cls.lichHocs.length > 0 && 
            cls.trangThai !== 'KetThuc' && cls.trangThai !== 'Huy') {
          cls.lichHocs.forEach(lich => {
            allSchedules.push({
              ...lich,
              tenLop: cls.tenLop,
              maLop: cls.maLop,
              monHoc: cls.monHoc?.tenMon || 'N/A',
              hinhThuc: cls.hinhThuc,
              soHocVien: cls.soHocVien ?? cls._count?.dangKys ?? cls.dangKys?.length ?? 0,
              trangThai: cls.trangThai,
            });
          });
        }
      });

      // Sort by day of week, then by start time
      allSchedules.sort((a, b) => {
        const dayDiff = (a.thu || 0) - (b.thu || 0);
        if (dayDiff !== 0) return dayDiff;
        return parseTimeToMinutes(a.gioBatDau) - parseTimeToMinutes(b.gioBatDau);
      });
      
      setSchedules(allSchedules);
    } catch (err) {
      toast.error('Không thể tải lịch dạy');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      // Backend trả ISO với ngày gốc 1970-01-01, cần lấy giờ/phút UTC để không lệch TZ
      const date = new Date(timeStr);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (err) {
      console.error('Invalid time value:', timeStr, err);
      return '';
    }
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    try {
      const date = new Date(timeStr);
      return date.getUTCHours() * 60 + date.getUTCMinutes();
    } catch (err) {
      return 0;
    }
  };

  // Group schedules by week instead of by day
  const groupByWeek = () => {
    // Group by class first
    const byClass = {};
    schedules.forEach(sch => {
      if (!byClass[sch.maLop]) {
        byClass[sch.maLop] = [];
      }
      byClass[sch.maLop].push(sch);
    });

    // For each class, group schedules into weeks
    const weeks = [];
    Object.values(byClass).forEach(classSchedules => {
      // CRITICAL: DO NOT sort by thu here!
      // Backend already generated in correct chronological order
      // Sorting by thu will group all Mondays together, breaking week grouping
      
      // Count unique days per week for this class
      const uniqueDays = [...new Set(classSchedules.map(s => s.thu))];
      const daysPerWeek = uniqueDays.length;
      
      // Split into weeks based on position, not day of week
      for (let i = 0; i < classSchedules.length; i += daysPerWeek) {
        const weekSchedules = classSchedules.slice(i, i + daysPerWeek);
        if (weekSchedules.length > 0) {
          // Sort within each week by thu for display
          weekSchedules.sort((a, b) => (a.thu || 0) - (b.thu || 0));
          weeks.push(weekSchedules);
        }
      }
    });

    return weeks;
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  const weeklySchedules = groupByWeek();
  const currentWeekData = weeklySchedules[currentWeek] || [];
  const totalWeeks = weeklySchedules.length;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>📅 Lịch Dạy Của Tôi</h1>
          <p>Quản lý lịch giảng dạy các lớp học - Hiển thị theo tuần</p>
        </div>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có lịch dạy nào</p>
          </div>
        ) : (
          <div className="schedule-container">
            {/* Navigation Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentWeek(prev => Math.max(0, prev - 1))}
                disabled={currentWeek === 0}
                style={{display: 'flex', alignItems: 'center', gap: '5px'}}
              >
                ⬅️ Tuần trước
              </button>
              
              <div style={{textAlign: 'center'}}>
                <h3 style={{margin: 0, color: '#667eea'}}>Tuần {currentWeek + 1} / {totalWeeks}</h3>
                {currentWeekData.length > 0 && (
                  <small style={{color: '#666'}}>
                    {currentWeekData[0]?.tenLop}
                  </small>
                )}
              </div>

              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentWeek(prev => Math.min(totalWeeks - 1, prev + 1))}
                disabled={currentWeek === totalWeeks - 1}
                style={{display: 'flex', alignItems: 'center', gap: '5px'}}
              >
                Tuần sau ➡️
              </button>
            </div>

            {/* Single Week View */}
            {currentWeekData.length > 0 ? (
              <div style={{
                padding: '20px',
                border: '2px solid #667eea',
                borderRadius: '12px',
                backgroundColor: '#f8f9ff',
                minHeight: '300px'
              }}>
                <div className="schedule-list">
                  {currentWeekData.map((sch, idx) => {
                    // Use ngayHoc if available, otherwise fallback to template logic
                    const displayDate = sch.ngayHoc ? formatShortDate(new Date(sch.ngayHoc)) : getDayName(sch.thu);
                    
                    return (
                      <div key={sch.maLich || idx} className="schedule-item tutor-schedule">
                        <div className="schedule-time">
                          <div style={{fontSize: '0.9em', color: '#667eea', fontWeight: '600', marginBottom: '4px'}}>
                            {sch.ngayHoc ? getDayName(sch.thu) : getDayName(sch.thu)}
                          </div>
                          {sch.ngayHoc && (
                            <div style={{fontSize: '1.1em', fontWeight: 'bold', color: '#2d3748'}}>
                              {formatShortDate(new Date(sch.ngayHoc))}
                            </div>
                          )}
                          <span className="time-badge">
                            🕐 {formatTime(sch.gioBatDau)} - {formatTime(sch.gioKetThuc)}
                          </span>
                        </div>
                        <div className="schedule-details">
                          <h3>{sch.tenLop}</h3>
                          <p className="schedule-subject">📖 Môn: {sch.monHoc}</p>
                          <p className="schedule-students">👥 Học viên: {sch.soHocVien || 0}/1 (lớp 1-1)</p>
                          {sch.hinhThuc === 'Online' && sch.linkHocOnline && (
                            <p className="schedule-link">
                              💻 <a href={sch.linkHocOnline} target="_blank" rel="noopener noreferrer">
                                Link dạy online
                              </a>
                            </p>
                          )}
                          {sch.hinhThuc === 'Offline' && sch.phongHoc && (
                            <p className="schedule-room">🏫 Phòng: {sch.phongHoc}</p>
                          )}
                          <div style={{marginTop: '8px'}}>
                            <span className={`badge badge-${sch.hinhThuc === 'Online' ? 'primary' : 'secondary'}`}>
                              {sch.hinhThuc === 'Online' ? '💻 Online' : '🏠 Offline'}
                            </span>
                            {' '}
                            <span className={`badge badge-${getStatusClass(sch.trangThai)}`}>
                              {sch.trangThai}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Không có lịch học trong tuần này</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
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

export default TutorSchedule;
