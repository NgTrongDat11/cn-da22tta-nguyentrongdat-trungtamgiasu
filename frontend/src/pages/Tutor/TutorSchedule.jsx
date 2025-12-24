/**
 * TUTOR - LỊCH DẠY
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { tutorAPI } from '../../api/services';
import './Tutor.css';

const TutorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

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
        if (cls && cls.lichHocs && cls.lichHocs.length > 0) {
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

  const getDayName = (thu) => {
    const dayNames = {
      2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 
      6: 'Sáu', 7: 'Bảy', 8: 'Chủ Nhật'
    };
    return dayNames[thu] || 'N/A';
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

  const groupByDay = () => {
    const grouped = {};
    schedules.forEach(sch => {
      const dayName = getDayName(sch.thu);
      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(sch);
    });
    return grouped;
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  const groupedSchedules = groupByDay();
  const daysOrder = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Chủ Nhật'];

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>📅 Lịch Dạy Của Tôi</h1>
          <p>Quản lý lịch giảng dạy các lớp học</p>
        </div>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có lịch dạy nào</p>
          </div>
        ) : (
          <div className="schedule-container">
            {daysOrder.filter(day => groupedSchedules[day]).map(day => (
              <div key={day} className="day-schedule">
                <h2 className="day-header">
                  <span className="day-icon">👨‍🏫</span>
                  Thứ {day}
                </h2>
                <div className="schedule-list">
                  {groupedSchedules[day].map((sch, idx) => (
                    <div key={sch.maLich || idx} className="schedule-item tutor-schedule">
                      <div className="schedule-time">
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
                  ))}
                </div>
              </div>
            ))}
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
