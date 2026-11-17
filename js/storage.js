/**
 * TẦNG TRUY CẬP DỮ LIỆU (STORAGE / DATA ACCESS LAYER)
 * Quản lý đọc/ghi lịch hẹn bằng localStorage (key: "mmc_bookings")
 * Tách biệt hoàn toàn để có thể thay thế bằng REST API/GraphQL ở phiên bản sau.
 * Namespace: window.MMC.storage
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};
  const STORAGE_KEY = 'mmc_bookings';

  // Bộ nhớ tạm phòng trường hợp trình duyệt chặn localStorage (chế độ ẩn danh nghiêm ngặt hoặc lỗi file://)
  let memoryStorageFallback = null;

  /**
   * Kiểm tra khả năng hoạt động của localStorage
   * @returns {boolean}
   */
  function isLocalStorageAvailable() {
    try {
      const testKey = '__mmc_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Khởi tạo và nạp dữ liệu mẫu ban đầu nếu localStorage chưa có
   * @returns {Array} Mảng các booking hiện có
   */
  function initStorage() {
    const existing = getBookings();
    if (existing && existing.length > 0) {
      return existing;
    }

    // Nếu chưa có, tự động tạo 2 lịch hẹn mẫu sắp tới
    return seedSampleBookings();
  }

  /**
   * Tạo 2 lịch hẹn mẫu sắp tới cho người học mặc định (Nguyễn Minh Anh)
   * Tính ngày dựa theo ngày hiện tại của máy để demo luôn thấy lịch "Sắp tới"
   * @returns {Array}
   */
  function seedSampleBookings() {
    const today = new Date();
    const seeded = DEFAULT_SAMPLE_BOOKINGS_CONFIG.map((cfg, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + cfg.offsetDays);
      const dateStr = MMC.utils.formatDateLocal(targetDate);

      return {
        id: `bk_sample_${index + 1}_${Date.now()}`,
        mentorId: cfg.mentorId,
        mentorName: cfg.mentorName,
        date: dateStr,
        time: cfg.time,
        topic: cfg.topic,
        note: cfg.note,
        status: 'upcoming',
        meetingLink: cfg.meetingLink,
        createdAt: new Date().toISOString()
      };
    });

    saveBookings(seeded);
    return seeded;
  }

  /**
   * Lấy toàn bộ danh sách lịch hẹn từ localStorage (hoặc fallback)
   * @returns {Array}
   */
  function getBookings() {
    try {
      if (isLocalStorageAvailable()) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } else if (memoryStorageFallback !== null) {
        return memoryStorageFallback;
      }
    } catch (err) {
      console.warn('Lỗi khi đọc dữ liệu từ localStorage, sử dụng bộ nhớ tạm:', err);
      if (memoryStorageFallback !== null) return memoryStorageFallback;
    }
    return [];
  }

  /**
   * Ghi danh sách lịch hẹn vào localStorage (hoặc fallback)
   * @param {Array} bookings
   * @returns {boolean}
   */
  function saveBookings(bookings) {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      }
      memoryStorageFallback = bookings;
      return true;
    } catch (err) {
      console.error('Không thể lưu vào localStorage:', err);
      memoryStorageFallback = bookings;
      return false;
    }
  }

  /**
   * Kiểm tra một slot giờ đã trôi qua so với thời gian thực của máy chưa
   * @param {string} dateStr Dạng "YYYY-MM-DD"
   * @param {string} timeStr Dạng "HH:mm"
   * @returns {boolean}
   */
  function isSlotPast(dateStr, timeStr) {
    const now = new Date();
    const slotStart = MMC.utils.getSlotStartDateTime(dateStr, timeStr);
    return now >= slotStart;
  }

  /**
   * Kiểm tra khung giờ đã có ai đặt chưa:
   * 1. Kiểm tra TAKEN_SLOTS (người học khác đặt mẫu)
   * 2. Kiểm tra các booking hiện hữu có status === 'upcoming' của cùng cố vấn/ngày/giờ
   * 
   * @param {string} mentorId Mã cố vấn
   * @param {string} dateStr Ngày dạng "YYYY-MM-DD"
   * @param {string} timeStr Giờ dạng "HH:mm"
   * @returns {boolean}
   */
  function isSlotTaken(mentorId, dateStr, timeStr) {
    // 1. Kiểm tra TAKEN_SLOTS mẫu theo offsetDays tính từ hôm nay
    const today = new Date();
    const hasTakenByOthers = TAKEN_SLOTS.some(slot => {
      if (slot.mentorId !== mentorId || slot.time !== timeStr) {
        return false;
      }
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + slot.offsetDays);
      const slotDateStr = MMC.utils.formatDateLocal(slotDate);
      return slotDateStr === dateStr;
    });

    if (hasTakenByOthers) return true;

    // 2. Kiểm tra trong các booking của hệ thống
    const bookings = getBookings();
    const hasBooked = bookings.some(b => 
      b.mentorId === mentorId &&
      b.date === dateStr &&
      b.time === timeStr &&
      b.status === 'upcoming'
    );

    return hasBooked;
  }

  /**
   * Kiểm tra người học hiện tại đã có lịch hẹn 'upcoming' nào trùng ngày & giờ đó chưa
   * (áp dụng cho bất kỳ cố vấn nào)
   * @param {string} dateStr Ngày dạng "YYYY-MM-DD"
   * @param {string} timeStr Giờ dạng "HH:mm"
   * @param {string} [excludeBookingId] Bỏ qua bookingId này (nếu là cập nhật)
   * @returns {boolean}
   */
  function hasMenteeConflict(dateStr, timeStr, excludeBookingId = null) {
    const bookings = getBookings();
    return bookings.some(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      return (
        b.date === dateStr &&
        b.time === timeStr &&
        b.status === 'upcoming'
      );
    });
  }

  /**
   * Tìm khung giờ rảnh sớm nhất tiếp theo của một cố vấn trong 7 ngày tới
   * Bỏ qua các slot đã qua hoặc đã kín
   * @param {Object} mentor Đối tượng cố vấn
   * @returns {Object|null} { dateStr, timeStr, dayOfWeek, displayText } hoặc null nếu hết lịch
   */
  function getNextAvailableSlot(mentor) {
    if (!mentor || !mentor.availability) return null;

    const today = new Date();
    // Quét 7 ngày tới (từ hôm nay đến +6 ngày)
    for (let offset = 0; offset < 7; offset++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + offset);
      const dayOfWeek = checkDate.getDay();
      const dateStr = MMC.utils.formatDateLocal(checkDate);

      const slots = mentor.availability[dayOfWeek];
      if (Array.isArray(slots) && slots.length > 0) {
        // Sắp xếp các giờ tăng dần
        const sortedSlots = [...slots].sort();
        for (const timeStr of sortedSlots) {
          // Bỏ qua nếu đã qua thời gian hiện tại
          if (isSlotPast(dateStr, timeStr)) continue;
          // Bỏ qua nếu slot đã kín
          if (isSlotTaken(mentor.id, dateStr, timeStr)) continue;

          // Tìm thấy slot trống sớm nhất
          const dayName = offset === 0 ? 'Hôm nay' : (offset === 1 ? 'Ngày mai' : MMC.utils.getDayOfWeekText(dayOfWeek));
          const dateShort = MMC.utils.formatDisplayDate(dateStr, false, false);
          return {
            dateStr,
            timeStr,
            dayOfWeek,
            offsetDays: offset,
            displayText: `${dayName} (${dateShort}), ${timeStr}`
          };
        }
      }
    }
    return null;
  }

  /**
   * Thêm mới một lịch hẹn với 5 bước kiểm tra tuần tự chặt chẽ:
   * 1. Đã chọn slot chưa
   * 2. Chủ đề hợp lệ (5-100 ký tự)
   * 3. Slot chưa trôi qua so với thời gian máy hiện tại
   * 4. Slot chưa bị đặt (bởi TAKEN_SLOTS hoặc booking 'upcoming' khác)
   * 5. Người học chưa có lịch hẹn 'upcoming' khác trùng ngày giờ
   * 
   * @param {Object} bookingData { mentorId, mentorName, date, time, topic, note }
   * @returns {Object} { success: boolean, booking?: Object, error?: string, errorCode?: string }
   */
  function addBooking(bookingData) {
    const { mentorId, mentorName, date, time, topic, note } = bookingData;

    // Bước 1: Kiểm tra slot
    if (!mentorId || !date || !time) {
      return {
        success: false,
        error: 'Vui lòng chọn ngày và khung giờ bạn muốn đặt hẹn.',
        errorCode: 'SLOT_REQUIRED'
      };
    }

    // Bước 2: Kiểm tra chủ đề (bắt buộc, 5-100 ký tự)
    const cleanTopic = (topic || '').trim();
    if (cleanTopic.length < 5 || cleanTopic.length > 100) {
      return {
        success: false,
        error: 'Chủ đề trao đổi phải có độ dài từ 5 đến 100 ký tự.',
        errorCode: 'INVALID_TOPIC'
      };
    }

    // Bước 3: Kiểm tra slot chưa trôi qua
    if (isSlotPast(date, time)) {
      return {
        success: false,
        error: 'Khung giờ này đã trôi qua so với thời điểm hiện tại. Vui lòng chọn khung giờ khác.',
        errorCode: 'SLOT_PAST'
      };
    }

    // Bước 4: Kiểm tra slot chưa bị đặt
    if (isSlotTaken(mentorId, date, time)) {
      return {
        success: false,
        error: 'Khung giờ này của cố vấn vừa được đặt bởi người khác hoặc đã kín. Vui lòng chọn slot khác.',
        errorCode: 'SLOT_TAKEN'
      };
    }

    // Bước 5: Kiểm tra xung đột lịch người học (trùng ngày & giờ với cố vấn khác)
    if (hasMenteeConflict(date, time)) {
      return {
        success: false,
        error: 'Bạn đã có lịch hẹn khác vào khung giờ này. Vui lòng chọn khung giờ không bị trùng lịch.',
        errorCode: 'MENTEE_CONFLICT'
      };
    }

    // Sinh mã cuộc họp demo ngẫu nhiên
    const randomMeetingHash = Math.random().toString(36).substring(2, 7);
    const meetingLink = `https://meet.example.com/mmc-${randomMeetingHash}`;

    const newBooking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      mentorId,
      mentorName: mentorName || 'Cố vấn MMC',
      date,
      time,
      topic: cleanTopic,
      note: (note || '').trim().slice(0, 300),
      status: 'upcoming',
      meetingLink,
      createdAt: new Date().toISOString()
    };

    const bookings = getBookings();
    bookings.push(newBooking);
    saveBookings(bookings);

    return {
      success: true,
      booking: newBooking
    };
  }

  /**
   * Hủy một lịch hẹn (chuyển status sang 'cancelled')
   * Giải phóng slot ngay lập tức
   * @param {string} bookingId
   * @returns {boolean}
   */
  function cancelBooking(bookingId) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return false;

    bookings[index].status = 'cancelled';
    bookings[index].cancelledAt = new Date().toISOString();
    saveBookings(bookings);
    return true;
  }

  /**
   * Đặt lại toàn bộ dữ liệu mẫu (Reset Sample Data)
   * Xóa localStorage và nạp lại 2 buổi hẹn mẫu mặc định
   * @returns {Array}
   */
  function resetSampleData() {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn(e);
    }
    memoryStorageFallback = null;
    return seedSampleBookings();
  }

  /**
   * Đếm số lượng buổi hẹn sắp tới thực tế (status: 'upcoming' và giờ kết thúc chưa qua)
   * @returns {number}
   */
  function countUpcomingBookings() {
    const now = new Date();
    const bookings = getBookings();
    return bookings.filter(b => {
      if (b.status !== 'upcoming') return false;
      const endDateTime = MMC.utils.getSlotEndDateTime(b.date, b.time);
      return now < endDateTime;
    }).length;
  }

  // Khởi chạy nạp dữ liệu ban đầu
  initStorage();

  // Xuất API tầng storage
  MMC.storage = {
    initStorage,
    getBookings,
    saveBookings,
    isSlotPast,
    isSlotTaken,
    hasMenteeConflict,
    getNextAvailableSlot,
    addBooking,
    cancelBooking,
    resetSampleData,
    countUpcomingBookings
  };

  window.MMC = MMC;
})(window);
