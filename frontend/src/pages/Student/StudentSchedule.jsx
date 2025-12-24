/**
 * STUDENT - LỊCH HỌC
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { studentAPI } from '../../api/services';
import './Student.css';

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'list'

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const registrations = await studentAPI.getMyRegistrations({ trangThai: 'DaDuyet' });
      
      // Extract all schedules from registered classes
      const allSchedules = [];
      registrations.forEach(reg => {
        const cls = reg.lopHoc;
        if (cls && cls.lichHocs && cls.lichHocs.length > 0) {
          cls.lichHocs.forEach(lich => {
            allSchedules.push({
              ...lich,
              tenLop: cls.tenLop,
              maLop: cls.maLop,
              monHoc: cls.monHoc?.tenMon || 'N/A',
              giaSuName: cls.hopDongs?.[0]?.giaSu?.hoTen || 'Chưa có',
              hinhThuc: cls.hinhThuc,
              trangThai: cls.trangThai,
            });
          });
        }
      });

      // Sort by day of week, then by start time
      allSchedules.sort((a, b) => {
        const dayDiff = (a.thu || 0) - (b.thu || 0);
        if (dayDiff !== 0) return dayDiff;
        return new Date('1970-01-01T' + a.gioBatDau).getTime() - 
               new Date('1970-01-01T' + b.gioBatDau).getTime();
      });
      
      setSchedules(allSchedules);
    } catch (err) {
      toast.error('Không thể tải lịch học');
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
    // timeStr format: "HH:MM:SS" or Date object
    if (typeof timeStr === 'string') {
      return timeStr.slice(0, 5); // HH:MM
    }
    const date = new Date(timeStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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
          <h1>📅 Lịch Học Của Tôi</h1>
          <p>Xem lịch học các lớp đã đăng ký</p>
        </div>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có lịch học nào. Hãy đăng ký lớp học!</p>
          </div>
        ) : (
          <div className="schedule-container">
            {daysOrder.filter(day => groupedSchedules[day]).map(day => (
              <div key={day} className="day-schedule">
                <h2 className="day-header">
                  <span className="day-icon">📚</span>
                  Thứ {day}
                </h2>
                <div className="schedule-list">
                  {groupedSchedules[day].map((sch, idx) => (
                    <div key={sch.maLich || idx} className="schedule-item">
                      <div className="schedule-time">
                        <span className="time-badge">
                          🕐 {formatTime(sch.gioBatDau)} - {formatTime(sch.gioKetThuc)}
                        </span>
                      </div>
                      <div className="schedule-details">
                        <h3>{sch.tenLop}</h3>
                        <p className="schedule-subject">📖 Môn: {sch.monHoc}</p>
                        <p className="schedule-tutor">👨‍🏫 Giáo viên: {sch.giaSuName}</p>
                        {sch.hinhThuc === 'Online' && sch.linkHocOnline && (
                          <p className="schedule-link">
                            💻 <a href={sch.linkHocOnline} target="_blank" rel="noopener noreferrer">
                              Link học online
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

export default StudentSchedule;
