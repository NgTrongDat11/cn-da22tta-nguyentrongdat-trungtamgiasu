/**
 * STUDENT - XEM ĐÁNH GIÁ TỪ GIA SƯ
 * Read-only: Học viên chỉ xem, không đánh giá ngược lại
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import './Student.css';

const StudentRatings = () => {
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const response = await apiClient.get('/hoc-vien/danh-gia-cua-toi');
      setMyRatings(response.data.data || []);
    } catch (err) {
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Đang tải...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>⭐ Đánh Giá Từ Gia Sư</h1>
          <p className="text-muted">Xem các đánh giá mà gia sư đã gửi cho bạn</p>
        </div>

        {myRatings.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa nhận được đánh giá nào từ gia sư</p>
          </div>
        ) : (
          <div className="ratings-grid">
            {myRatings.map(rating => (
              <div key={rating.maDanhGia} className="rating-card">
                <div className="rating-header">
                  <div className="tutor-info">
                    {rating.giaSu?.hinhAnh && (
                      <img src={rating.giaSu.hinhAnh} alt="Avatar" className="avatar-md" />
                    )}
                    <div>
                      <h3>{rating.giaSu?.hoTen}</h3>
                      <p className="text-muted">{rating.lopHoc?.tenLop}</p>
                    </div>
                  </div>
                  {rating.diem && (
                    <div className="rating-score">
                      ⭐ {rating.diem}/5
                    </div>
                  )}
                </div>
                {rating.nhanXet && (
                  <div className="rating-comment">
                    <p>{rating.nhanXet}</p>
                  </div>
                )}
                <div className="rating-date">
                  {new Date(rating.ngayDanhGia).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentRatings;
