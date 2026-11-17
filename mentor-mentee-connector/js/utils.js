/**
 * CÁC HÀM TIỆN ÍCH DÙNG CHUNG (UTILS)
 * Namespace: window.MMC
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};

  /**
   * Bỏ dấu tiếng Việt và chuẩn hóa chuỗi về chữ thường không dấu
   * Phục vụ tìm kiếm không phân biệt dấu và chữ hoa/thường: "thuyet trinh" khớp "thuyết trình"
   * @param {string} str Chuỗi đầu vào
   * @returns {string} Chuỗi không dấu, chữ thường
   */
  function removeVietnameseDiacritics(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu thanh
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  /**
   * Thoát ký tự đặc biệt HTML nhằm chống tấn công XSS
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Định dạng đối tượng Date thành chuỗi "YYYY-MM-DD" THEO GIỜ ĐỊA PHƯƠNG
   * Tuyệt đối không dùng toISOString() vì múi giờ UTC+7 sẽ làm lệch ngày.
   * @param {Date} date
   * @returns {string} Chuỗi dạng "YYYY-MM-DD"
   */
  function formatDateLocal(date) {
    if (!date || typeof date.getFullYear !== 'function' || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Chuyển đổi chuỗi "YYYY-MM-DD" thành đối tượng Date địa phương (lúc 00:00:00)
   * @param {string} dateStr Chuỗi định dạng "YYYY-MM-DD"
   * @returns {Date}
   */
  function parseDateLocal(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return new Date();
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date();
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  /**
   * Lấy tên thứ trong tuần bằng tiếng Việt
   * @param {number} dayIndex 0=Chủ Nhật, 1=Thứ Hai, ... 6=Thứ Bảy
   * @returns {string}
   */
  function getDayOfWeekText(dayIndex) {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy'
    ];
    return days[dayIndex] || '';
  }

  /**
   * Lấy tên thứ ngắn gọn (ví dụ: "CN", "T2", "T3",...)
   * @param {number} dayIndex
   * @returns {string}
   */
  function getShortDayOfWeekText(dayIndex) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[dayIndex] || '';
  }

  /**
   * Định dạng hiển thị ngày tiếng Việt đầy đủ hoặc ngắn
   * Ví dụ: "Thứ Hai, 17/11/2026" hoặc "17/11"
   * @param {string} dateStr Dạng "YYYY-MM-DD"
   * @param {boolean} includeDayOfWeek Có kèm tên thứ không
   * @param {boolean} includeYear Có kèm năm không
   * @returns {string}
   */
  function formatDisplayDate(dateStr, includeDayOfWeek = true, includeYear = true) {
    if (!dateStr) return '';
    const date = parseDateLocal(dateStr);
    const dayOfWeek = getDayOfWeekText(date.getDay());
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const dateFormatted = includeYear ? `${day}/${month}/${year}` : `${day}/${month}`;
    if (includeDayOfWeek) {
      return `${dayOfWeek}, ${dateFormatted}`;
    }
    return dateFormatted;
  }

  /**
   * Định dạng khung giờ 60 phút
   * Ví dụ: "19:00" -> "19:00 - 20:00"
   * @param {string} timeStr Dạng "HH:mm"
   * @returns {string}
   */
  function formatTimeSlot(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return '';
    const [hStr, mStr] = timeStr.split(':');
    const hour = parseInt(hStr, 10);
    const endHour = hour + 1;
    const endHourStr = String(endHour).padStart(2, '0');
    const minute = mStr || '00';
    return `${timeStr} - ${endHourStr}:${minute}`;
  }

  /**
   * Lấy thời điểm bắt đầu của slot dưới dạng Date địa phương
   * @param {string} dateStr Dạng "YYYY-MM-DD"
   * @param {string} timeStr Dạng "HH:mm"
   * @returns {Date}
   */
  function getSlotStartDateTime(dateStr, timeStr) {
    const d = parseDateLocal(dateStr);
    if (!timeStr) return d;
    const [h, m] = timeStr.split(':');
    d.setHours(parseInt(h, 10) || 0, parseInt(m, 10) || 0, 0, 0);
    return d;
  }

  /**
   * Lấy thời điểm kết thúc của slot (sau 60 phút) dưới dạng Date địa phương
   * @param {string} dateStr Dạng "YYYY-MM-DD"
   * @param {string} timeStr Dạng "HH:mm"
   * @returns {Date}
   */
  function getSlotEndDateTime(dateStr, timeStr) {
    const start = getSlotStartDateTime(dateStr, timeStr);
    return new Date(start.getTime() + 60 * 60 * 1000);
  }

  /**
   * Tính toán dòng đếm ngược tương đối tới buổi hẹn
   * @param {string} dateStr Dạng "YYYY-MM-DD"
   * @param {string} timeStr Dạng "HH:mm"
   * @returns {string} Chuỗi đếm ngược tiếng Việt
   */
  function getRelativeTimeCountdown(dateStr, timeStr) {
    const now = new Date();
    const start = getSlotStartDateTime(dateStr, timeStr);
    const end = getSlotEndDateTime(dateStr, timeStr);

    if (now >= end) {
      return 'Đã hoàn thành';
    }

    if (now >= start && now < end) {
      return 'Đang diễn ra ngay bây giờ';
    }

    const diffMs = start.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const todayStr = formatDateLocal(now);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = formatDateLocal(tomorrow);

    if (dateStr === todayStr) {
      if (diffHours >= 1) {
        return `Hôm nay, còn khoảng ${diffHours} giờ`;
      }
      return `Hôm nay, còn ${Math.max(1, diffMinutes)} phút`;
    }

    if (dateStr === tomorrowStr) {
      return `Ngày mai, lúc ${timeStr}`;
    }

    if (diffDays <= 7) {
      const dayText = getDayOfWeekText(start.getDay());
      return `Còn ${diffDays} ngày nữa (${dayText})`;
    }

    return `Còn ${diffDays} ngày`;
  }

  /**
   * Bảng màu gradient đẹp cho Avatar đại diện (không cần ảnh ngoài)
   */
  const AVATAR_GRADIENTS = [
    { bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#ffffff' },
    { bg: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)', color: '#ffffff' }
  ];

  /**
   * Lấy 1-2 chữ cái viết tắt từ tên người Việt
   * Ví dụ: "Trần Hoàng Nam" -> "TN", "Nguyễn Minh Anh" -> "NA"
   * @param {string} fullName
   * @returns {string}
   */
  function getInitials(fullName) {
    if (!fullName || typeof fullName !== 'string') return 'MC';
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    // Lấy chữ cái đầu họ và chữ cái đầu tên chính
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  }

  /**
   * Tạo mã màu nhất quán dựa trên tên (hash)
   * @param {string} str
   * @returns {number}
   */
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Bảng kích thước cố định pixel cho Avatar nhằm tránh giật layout (Cumulative Layout Shift)
   */
  const AVATAR_SIZES = {
    sm: 36,
    md: 52,
    lg: 72,
    xl: 96
  };

  /**
   * Tạo phần tử HTML Avatar:
   * - Nếu có avatarUrl: render thẻ <img> với width/height cố định, loading="lazy", alt=fullName.
   * - Có sẵn khối fallback (gradient + chữ cái đầu) ẩn bên dưới.
   * - Nếu ảnh không tồn tại hoặc lỗi tải: xử lý bằng addEventListener("error") để tự động quay về avatar gradient + chữ cái đầu.
   * 
   * @param {string} fullName Tên người
   * @param {'sm'|'md'|'lg'|'xl'} sizeClass Kích thước avatar
   * @param {string|null} [avatarUrl=null] Đường dẫn ảnh avatar
   * @returns {string} Chuỗi HTML
   */
  function renderAvatarHTML(fullName, sizeClass = 'md', avatarUrl = null) {
    const initials = escapeHTML(getInitials(fullName));
    const themeIndex = hashString(fullName || 'user') % AVATAR_GRADIENTS.length;
    const theme = AVATAR_GRADIENTS[themeIndex];
    const dimension = AVATAR_SIZES[sizeClass] || 52;
    const safeName = escapeHTML(fullName || 'Avatar');

    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim() !== '') {
      const safeUrl = escapeHTML(avatarUrl.trim());
      return `
        <div class="c-avatar c-avatar--${sizeClass}" 
             style="background: ${theme.bg}; color: ${theme.color};" 
             aria-label="${safeName}">
          <img class="c-avatar__img" 
               src="${safeUrl}" 
               alt="${safeName}" 
               loading="lazy" 
               width="${dimension}" 
               height="${dimension}">
          <span class="c-avatar__fallback" style="display: none;">${initials}</span>
        </div>
      `;
    }

    return `
      <div class="c-avatar c-avatar--${sizeClass}" 
           style="background: ${theme.bg}; color: ${theme.color};" 
           aria-label="${safeName}">
        <span class="c-avatar__fallback">${initials}</span>
      </div>
    `;
  }

  /**
   * Xử lý fallback cho avatar ảnh bị lỗi tải:
   * Ẩn thẻ <img> bị lỗi và hiển thị lại phần tử fallback (chữ cái đầu + nền gradient)
   * Tuyệt đối không dùng onerror inline trong HTML
   * @param {HTMLImageElement} img
   */
  function handleAvatarImgError(img) {
    if (!img) return;
    img.style.display = 'none';
    const parent = img.closest ? img.closest('.c-avatar') : img.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.c-avatar__fallback');
      if (fallback) {
        fallback.style.display = 'inline-flex';
      }
      parent.classList.add('c-avatar--fallback-active');
    }
  }

  /**
   * Gắn sự kiện error (bằng addEventListener("error")) cho tất cả các ảnh avatar trong một vùng DOM
   * @param {HTMLElement|Document} container
   */
  function attachAvatarErrorListeners(container = document) {
    if (!container || typeof container.querySelectorAll !== 'function') return;
    const images = container.querySelectorAll('.c-avatar__img');
    images.forEach(img => {
      if (img.dataset.hasAvatarErrorListener) return;
      img.dataset.hasAvatarErrorListener = 'true';

      img.addEventListener('error', function () {
        handleAvatarImgError(img);
      });

      // Nếu ảnh đã hoàn thành mà naturalWidth === 0 (tức là đã lỗi trước khi gắn listener)
      if (img.complete && img.naturalWidth === 0) {
        handleAvatarImgError(img);
      }
    });
  }

  // Lắng nghe toàn cục sự kiện 'error' trên capture phase
  // Vì sự kiện error của <img> không tự nổi bọt (bubble), nên capture phase trên window bắt được mọi <img> lỗi
  if (typeof window !== 'undefined') {
    window.addEventListener(
      'error',
      function (event) {
        const target = event.target;
        if (target && target.tagName === 'IMG' && target.classList && target.classList.contains('c-avatar__img')) {
          handleAvatarImgError(target);
        }
      },
      true
    );
  }

  /**
   * Hàm debounce hạn chế gọi lại hàm quá nhiều lần khi người dùng đang gõ
   * @param {Function} func
   * @param {number} wait Thời gian chờ tính bằng ms
   * @returns {Function}
   */
  function debounce(func, wait = 250) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * [ĐIỂM NHẤN THỂ HIỆN TẦM NHÌN DÀI HẠN]
   * Thuật toán stub ghép cặp (Matching) giữa Cố vấn và Nhu cầu người học.
   * Tính điểm khớp (Match Score 0-100%) dựa trên:
   * 1. Độ tương đồng kỹ năng yêu cầu (50% trọng số)
   * 2. Điểm đánh giá năng lực 360 độ (25% trọng số)
   * 3. Số khung giờ rảnh khả dụng trong 7 ngày tới (25% trọng số)
   * 
   * @param {Object} mentor Đối tượng cố vấn từ MENTORS
   * @param {Object} menteeNeeds { targetSkills: string[], preferredDays?: number[], preferredTimes?: string[] }
   * @returns {Object} { score: number, matchedSkills: string[], breakdown: Object }
   */
  function calculateMatchScore(mentor, menteeNeeds) {
    if (!mentor || !menteeNeeds || !Array.isArray(menteeNeeds.targetSkills)) {
      return { score: 0, matchedSkills: [], breakdown: {} };
    }

    const targetSkills = menteeNeeds.targetSkills;
    if (targetSkills.length === 0) {
      return { score: 100, matchedSkills: mentor.skills || [], breakdown: {} };
    }

    // 1. Kỹ năng trùng khớp
    const mentorSkillsNorm = (mentor.skills || []).map(s => removeVietnameseDiacritics(s));
    const matchedSkills = targetSkills.filter(ts =>
      mentorSkillsNorm.includes(removeVietnameseDiacritics(ts))
    );
    const skillRatio = matchedSkills.length / targetSkills.length;
    const skillScore = Math.min(100, Math.round(skillRatio * 100));

    // 2. Điểm đánh giá (quy đổi 5 sao ra thang 100)
    const ratingScore = Math.round(((mentor.rating || 4.0) / 5) * 100);

    // 3. Khung giờ rảnh khả dụng (tính số slot cố vấn có trong tuần)
    let totalSlots = 0;
    if (mentor.availability) {
      Object.values(mentor.availability).forEach(slots => {
        if (Array.isArray(slots)) totalSlots += slots.length;
      });
    }
    const availabilityScore = Math.min(100, Math.round((totalSlots / 15) * 100));

    // Trọng số tổng hợp
    const totalMatchScore = Math.round(
      skillScore * 0.5 + ratingScore * 0.25 + availabilityScore * 0.25
    );

    return {
      score: totalMatchScore,
      matchedSkills,
      breakdown: {
        skillScore,
        ratingScore,
        availabilityScore
      }
    };
  }

  // Xuất các hàm tiện ích vào namespace window.MMC
  MMC.utils = {
    removeVietnameseDiacritics,
    escapeHTML,
    formatDateLocal,
    parseDateLocal,
    getDayOfWeekText,
    getShortDayOfWeekText,
    formatDisplayDate,
    formatTimeSlot,
    getSlotStartDateTime,
    getSlotEndDateTime,
    getRelativeTimeCountdown,
    getInitials,
    renderAvatarHTML,
    handleAvatarImgError,
    attachAvatarErrorListeners,
    debounce,
    calculateMatchScore
  };

  window.MMC = MMC;
})(window);
