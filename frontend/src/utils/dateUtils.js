/**
 * Utility functions for date and time formatting
 */

/**
 * Convert day number to Vietnamese day name
 * @param {number} thu - Day number (2-8, where 8 = Sunday)
 * @returns {string} Vietnamese day name
 */
export const getDayName = (thu) => {
  const dayNames = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
    8: 'Chủ Nhật'
  };
  return dayNames[thu] || 'N/A';
};

/**
 * Get short day name for display
 * @param {number} thu - Day number (2-8)
 * @returns {string} Short day name (Hai, Ba, Tư, Năm, Sáu, Bảy, CN)
 */
export const getShortDayName = (thu) => {
  const shortNames = {
    2: 'Hai',
    3: 'Ba',
    4: 'Tư',
    5: 'Năm',
    6: 'Sáu',
    7: 'Bảy',
    8: 'CN'
  };
  return shortNames[thu] || 'N/A';
};

/**
 * Get next occurrence date of a weekday
 * @param {number} thu - Day number (2-8, where 8 = Sunday)
 * @returns {Date} Next occurrence of that weekday
 */
export const getNextWeekdayDate = (thu) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  
  // Convert thu (2-8) to JS day (1-7, 0)
  // thu=2 (Thứ 2) -> jsDay=1 (Monday)
  // thu=8 (Chủ Nhật) -> jsDay=0 (Sunday)
  const jsDay = thu === 8 ? 0 : thu - 1;
  
  let daysAhead = jsDay - currentDay;
  if (daysAhead < 0) {
    daysAhead += 7;
  }
  if (daysAhead === 0 && today.getHours() >= 12) {
    // If it's the same day but past noon, show next week
    daysAhead = 7;
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysAhead);
  return nextDate;
};

/**
 * Format date to Vietnamese short format
 * @param {Date} date - Date object
 * @returns {string} Formatted date (e.g., "26/12")
 */
export const formatShortDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

/**
 * Format date to Vietnamese full format
 * @param {Date} date - Date object
 * @returns {string} Formatted date (e.g., "26/12/2025")
 */
export const formatFullDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format time string from ISO date to HH:MM
 * @param {string} timeStr - ISO time string (e.g., "1970-01-01T08:00:00.000Z")
 * @returns {string} Formatted time (e.g., "08:00")
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    if (typeof timeStr === 'string' && timeStr.includes(':') && !timeStr.includes('T')) {
      // Already in HH:MM:SS format
      return timeStr.slice(0, 5);
    }
    // Parse ISO date and extract UTC hours/minutes
    const date = new Date(timeStr);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (err) {
    console.error('Invalid time value:', timeStr, err);
    return '';
  }
};
