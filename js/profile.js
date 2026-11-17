/**
 * LOGIC TRANG HỒ SƠ CỐ VẤN & XỬ LÝ ĐẶT LỊCH HẸN
 * Namespace: window.MMC
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};

  // Trạng thái cục bộ của trang Profile
  let currentMentor = null;
  let selectedDayIndex = 0; // 0 = Hôm nay, 1 = Ngày mai, ..., 6 = +6 ngày
  let selectedSlot = null;  // { dateStr, timeStr, dayOfWeek }
  let isSubmitting = false;

  // DOM Elements
  let notFoundEl = null;
  let contentEl = null;
  let dayTabsContainer = null;
  let slotsGridContainer = null;
  let noSlotsDayMessage = null;
  let slotSummaryEmpty = null;
  let slotSummarySelected = null;
  let summaryDateTimeText = null;
  let bookingForm = null;
  let topicInput = null;
  let noteInput = null;
  let topicCharCount = null;
  let noteCharCount = null;
  let topicError = null;
  let formGeneralError = null;
  let submitBookingBtn = null;
  let successModal = null;

  /**
   * Khởi tạo trang Profile
   */
  function init() {
    // Truy vấn DOM
    notFoundEl = document.getElementById('mentor-not-found');
    contentEl = document.getElementById('mentor-profile-content');
    dayTabsContainer = document.getElementById('day-tabs-container');
    slotsGridContainer = document.getElementById('slots-grid-container');
    noSlotsDayMessage = document.getElementById('no-slots-day-message');
    slotSummaryEmpty = document.getElementById('slot-summary-empty');
    slotSummarySelected = document.getElementById('slot-summary-selected');
    summaryDateTimeText = document.getElementById('summary-datetime-text');
    bookingForm = document.getElementById('booking-form');
    topicInput = document.getElementById('topic-input');
    noteInput = document.getElementById('note-input');
    topicCharCount = document.getElementById('topic-char-count');
    noteCharCount = document.getElementById('note-char-count');
    topicError = document.getElementById('topic-error');
    formGeneralError = document.getElementById('form-general-error');
    submitBookingBtn = document.getElementById('submit-booking-btn');
    successModal = document.getElementById('booking-success-modal');

    // Lấy mentorId từ query string
    const urlParams = new URLSearchParams(window.location.search);
    const mentorId = urlParams.get('id');

    if (!mentorId || !Array.isArray(MENTORS)) {
      showNotFound();
      return;
    }

    currentMentor = MENTORS.find(m => m.id === mentorId);
    if (!currentMentor) {
      showNotFound();
      return;
    }

    // Hiển thị nội dung
    notFoundEl.style.display = 'none';
    contentEl.style.display = 'flex';
    document.title = `${currentMentor.name} - Hồ sơ Cố vấn | Mentor Connect`;

    renderMentorInfo();
    renderRating360();
    renderDayTabs();
    renderSlotsForSelectedDay();
    attachFormListeners();
  }

  /**
   * Hiển thị trạng thái không tìm thấy cố vấn
   */
  function showNotFound() {
    if (notFoundEl) notFoundEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
    document.title = 'Không tìm thấy Cố vấn - Mentor Connect';
  }

  /**
   * Hiển thị thông tin tổng quan của Cố vấn
   */
  function renderMentorInfo() {
    // Breadcrumb
    const bcMentor = document.getElementById('breadcrumb-current-mentor');
    if (bcMentor) bcMentor.textContent = currentMentor.name;

    // Header info
    const avatarContainer = document.getElementById('mentor-avatar-container');
    if (avatarContainer) {
      avatarContainer.innerHTML = MMC.utils.renderAvatarHTML(currentMentor.name, 'xl');
    }

    document.getElementById('mentor-name').textContent = currentMentor.name;
    document.getElementById('mentor-title').textContent = currentMentor.title;
    document.getElementById('mentor-bio').textContent = currentMentor.bio;
    document.getElementById('mentor-languages').textContent = (currentMentor.languages || []).join(', ');

    // Skills pills
    const skillsContainer = document.getElementById('mentor-skills-tags');
    if (skillsContainer) {
      skillsContainer.innerHTML = (currentMentor.skills || []).map(skill => {
        return `<span class="c-skill-tag">${MMC.utils.escapeHTML(skill)}</span>`;
      }).join('');
    }

    // 4 chỉ số thống kê
    document.getElementById('stat-rating').textContent = currentMentor.rating.toFixed(1);
    document.getElementById('stat-reviews').textContent = `${currentMentor.reviewCount} lượt`;
    document.getElementById('stat-experience').textContent = `${currentMentor.experienceYears} năm`;
    document.getElementById('stat-sessions').textContent = `${currentMentor.sessionsTaught} buổi`;
  }

  /**
   * Hiển thị Đánh giá 360 độ và danh sách đánh giá
   */
  function renderRating360() {
    document.getElementById('avg-rating-badge').textContent = currentMentor.rating.toFixed(1);
    document.getElementById('total-reviews-count').textContent = `(${currentMentor.reviewCount} đánh giá 360°)`;

    const rb = currentMentor.ratingBreakdown || { expertise: 4.8, communication: 4.8, punctuality: 4.8, helpfulness: 4.8 };

    // 4 Thanh tiến trình
    const updateProgressBar = (idVal, idPb, val) => {
      document.getElementById(idVal).textContent = val.toFixed(1);
      const pct = Math.min(100, Math.max(0, (val / 5) * 100));
      setTimeout(() => {
        const pb = document.getElementById(idPb);
        if (pb) pb.style.width = `${pct}%`;
      }, 50);
    };

    updateProgressBar('val-expertise', 'pb-expertise', rb.expertise || 5.0);
    updateProgressBar('val-communication', 'pb-communication', rb.communication || 4.8);
    updateProgressBar('val-punctuality', 'pb-punctuality', rb.punctuality || 4.9);
    updateProgressBar('val-helpfulness', 'pb-helpfulness', rb.helpfulness || 5.0);

    // Danh sách các phản hồi (reviews)
    const reviewsList = document.getElementById('reviews-list-container');
    if (reviewsList && Array.isArray(currentMentor.reviews)) {
      reviewsList.innerHTML = currentMentor.reviews.map(rev => {
        const starsText = '★'.repeat(Math.round(rev.rating)) + '☆'.repeat(5 - Math.round(rev.rating));
        const dateFormatted = MMC.utils.formatDisplayDate(rev.date, false, true);

        return `
          <article class="c-review-item">
            <div class="c-review-item__header">
              <div>
                <strong>${MMC.utils.escapeHTML(rev.author)}</strong>
                <span class="c-review-item__role">${MMC.utils.escapeHTML(rev.role)}</span>
              </div>
              <time datetime="${rev.date}" style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${dateFormatted}</time>
            </div>
            <div style="color: var(--color-accent); font-size: 13px; margin-bottom: 4px;" aria-label="${rev.rating} trên 5 sao">
              ${starsText} (${rev.rating})
            </div>
            <p class="c-review-item__comment">${MMC.utils.escapeHTML(rev.comment)}</p>
          </article>
        `;
      }).join('');
    }
  }

  /**
   * Tính ngày tương ứng với offsetDays (0 = Hôm nay, 1 = Ngày mai, ...)
   * @param {number} offset
   * @returns {Date}
   */
  function getDateByOffset(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }

  /**
   * Hiển thị hàng tab 7 ngày tới (Flexbox cuộn ngang)
   */
  function renderDayTabs() {
    if (!dayTabsContainer) return;

    let html = '';
    for (let offset = 0; offset < 7; offset++) {
      const date = getDateByOffset(offset);
      const dayOfWeek = date.getDay();
      const isSelected = offset === selectedDayIndex;
      const dateFormatted = MMC.utils.formatDisplayDate(MMC.utils.formatDateLocal(date), false, false);

      let dowLabel = MMC.utils.getDayOfWeekText(dayOfWeek);
      let badgeLabel = '';
      if (offset === 0) {
        badgeLabel = '<span class="c-day-tab__badge">Hôm nay</span>';
      } else if (offset === 1) {
        badgeLabel = '<span class="c-day-tab__badge">Ngày mai</span>';
      }

      html += `
        <button type="button" 
                class="c-day-tab ${isSelected ? 'c-day-tab--active' : ''}" 
                role="tab" 
                aria-selected="${isSelected}" 
                data-offset="${offset}">
          <span class="c-day-tab__dow">${dowLabel}</span>
          <span class="c-day-tab__date">${dateFormatted}</span>
          ${badgeLabel}
        </button>
      `;
    }

    dayTabsContainer.innerHTML = html;

    // Bắt sự kiện chọn tab ngày
    dayTabsContainer.querySelectorAll('.c-day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const offset = parseInt(tab.getAttribute('data-offset'), 10);
        if (selectedDayIndex === offset) return;

        selectedDayIndex = offset;
        dayTabsContainer.querySelectorAll('.c-day-tab').forEach(t => {
          const active = t === tab;
          t.classList.toggle('c-day-tab--active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        renderSlotsForSelectedDay();
      });
    });
  }

  /**
   * Hiển thị các khung giờ cho ngày đang chọn (Flexbox: flex-wrap, gap)
   * Phân biệt rõ 4 trạng thái: Còn trống, Đang chọn, Đã kín, Đã qua
   */
  function renderSlotsForSelectedDay() {
    if (!slotsGridContainer || !currentMentor) return;

    const date = getDateByOffset(selectedDayIndex);
    const dayOfWeek = date.getDay();
    const dateStr = MMC.utils.formatDateLocal(date);

    const availableHours = (currentMentor.availability && currentMentor.availability[dayOfWeek]) || [];

    if (!Array.isArray(availableHours) || availableHours.length === 0) {
      slotsGridContainer.innerHTML = '';
      noSlotsDayMessage.style.display = 'block';
      return;
    }

    noSlotsDayMessage.style.display = 'none';

    // Sắp xếp các giờ tăng dần
    const sortedHours = [...availableHours].sort();

    let slotsHTML = '';
    sortedHours.forEach(timeStr => {
      const slotTimeDisplay = MMC.utils.formatTimeSlot(timeStr);
      const isPast = MMC.storage.isSlotPast(dateStr, timeStr);
      const isTaken = MMC.storage.isSlotTaken(currentMentor.id, dateStr, timeStr);
      const isCurrentSelected = selectedSlot && 
                                selectedSlot.dateStr === dateStr && 
                                selectedSlot.timeStr === timeStr;

      if (isPast) {
        // TRẠNG THÁI 4: ĐÃ QUA (Chỉ xảy ra hôm nay, disabled)
        slotsHTML += `
          <button type="button" 
                  class="c-slot c-slot--past" 
                  disabled 
                  aria-disabled="true" 
                  title="Khung giờ này đã trôi qua">
            <span class="c-slot__icon" aria-hidden="true">⏰</span>
            <span>${slotTimeDisplay}</span>
            <span class="c-slot__badge" style="font-size: 10px; color: #94a3b8;">(Đã qua)</span>
          </button>
        `;
      } else if (isTaken) {
        // TRẠNG THÁI 3: ĐÃ KÍN (Đã có người đặt, viền đứt, gạch ngang, disabled)
        slotsHTML += `
          <button type="button" 
                  class="c-slot c-slot--booked" 
                  disabled 
                  aria-disabled="true" 
                  title="Khung giờ này đã kín">
            <span class="c-slot__icon" aria-hidden="true">🔒</span>
            <span>${slotTimeDisplay}</span>
            <span class="c-slot__badge">Đã đặt</span>
          </button>
        `;
      } else if (isCurrentSelected) {
        // TRẠNG THÁI 2: ĐANG CHỌN (Nổi bật, aria-pressed="true")
        slotsHTML += `
          <button type="button" 
                  class="c-slot c-slot--selected" 
                  aria-pressed="true" 
                  data-time="${timeStr}" 
                  data-date="${dateStr}" 
                  title="Khung giờ bạn đang chọn">
            <span class="c-slot__icon" aria-hidden="true">✔</span>
            <span>${slotTimeDisplay}</span>
          </button>
        `;
      } else {
        // TRẠNG THÁI 1: CÒN TRỐNG (Clickable, aria-pressed="false")
        slotsHTML += `
          <button type="button" 
                  class="c-slot c-slot--available" 
                  aria-pressed="false" 
                  data-time="${timeStr}" 
                  data-date="${dateStr}" 
                  title="Bấm để chọn khung giờ này">
            <span class="c-slot__icon" aria-hidden="true">⚡</span>
            <span>${slotTimeDisplay}</span>
          </button>
        `;
      }
    });

    slotsGridContainer.innerHTML = slotsHTML;

    // Gắn sự kiện click vào các slot có thể chọn
    slotsGridContainer.querySelectorAll('.c-slot--available, .c-slot--selected').forEach(btn => {
      btn.addEventListener('click', () => {
        const time = btn.getAttribute('data-time');
        const dStr = btn.getAttribute('data-date');
        handleSelectSlot(dStr, time);
      });
    });
  }

  /**
   * Xử lý khi người học chọn một khung giờ
   * @param {string} dateStr
   * @param {string} timeStr
   */
  function handleSelectSlot(dateStr, timeStr) {
    clearFormErrors();

    // Nếu bấm lại slot đang chọn thì giữ nguyên
    selectedSlot = {
      dateStr,
      timeStr,
      dayOfWeek: MMC.utils.parseDateLocal(dateStr).getDay()
    };

    // Vẽ lại danh sách slot để cập nhật class c-slot--selected
    renderSlotsForSelectedDay();

    // Cập nhật khối tóm tắt bên cột đặt lịch
    slotSummaryEmpty.style.display = 'none';
    slotSummarySelected.style.display = 'block';

    const fullDateText = MMC.utils.formatDisplayDate(dateStr, true, true);
    const slotTimeText = MMC.utils.formatTimeSlot(timeStr);
    summaryDateTimeText.innerHTML = `${fullDateText} <br><strong>Khung giờ: ${slotTimeText}</strong>`;

    // Kích hoạt nút submit
    submitBookingBtn.disabled = false;
    submitBookingBtn.removeAttribute('aria-disabled');

    // Tự động focus vào ô nhập chủ đề nếu chưa điền
    if (!topicInput.value.trim()) {
      topicInput.focus();
    }
  }

  /**
   * Xóa các thông báo lỗi inline trên form
   */
  function clearFormErrors() {
    formGeneralError.style.display = 'none';
    formGeneralError.textContent = '';
    topicError.style.display = 'none';
    topicError.textContent = '';
    topicInput.classList.remove('c-input--error');
  }

  /**
   * Hiển thị thông báo lỗi inline tại form (role="alert")
   * @param {string} message
   * @param {boolean} isTopicError
   */
  function showFormError(message, isTopicError = false) {
    if (isTopicError) {
      topicError.textContent = `⚠️ ${message}`;
      topicError.style.display = 'flex';
      topicInput.classList.add('c-input--error');
      topicInput.focus();
    } else {
      formGeneralError.textContent = `⚠️ ${message}`;
      formGeneralError.style.display = 'flex';
    }
  }

  /**
   * Đăng ký các bộ lắng nghe sự kiện của Form đặt lịch
   */
  function attachFormListeners() {
    // 1. Bộ đếm ký tự cho ô Chủ đề (tối đa 100)
    topicInput.addEventListener('input', () => {
      const len = topicInput.value.length;
      topicCharCount.textContent = `${len}/100`;
      if (len >= 5) {
        topicError.style.display = 'none';
        topicInput.classList.remove('c-input--error');
      }
    });

    // 2. Bộ đếm ký tự cho ô Ghi chú (tối đa 300)
    noteInput.addEventListener('input', () => {
      const len = noteInput.value.length;
      noteCharCount.textContent = `${len}/300`;
    });

    // 3. XỬ LÝ SỰ KIỆN SUBMIT FORM ĐẶT LỊCH (TRỌNG TÂM ĐÁNH GIÁ HỌC PHẦN)
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      clearFormErrors();

      // Bước 1: Kiểm tra đã chọn slot chưa
      if (!selectedSlot) {
        showFormError('Vui lòng chọn một khung giờ rảnh ở bảng bên trái trước khi xác nhận.');
        return;
      }

      // Bước 2: Kiểm tra chủ đề hợp lệ (độ dài từ 5 đến 100 ký tự)
      const topicVal = topicInput.value.trim();
      if (topicVal.length < 5 || topicVal.length > 100) {
        showFormError('Chủ đề trao đổi là bắt buộc và phải có độ dài từ 5 đến 100 ký tự.', true);
        return;
      }

      // Bước 3: Kiểm tra slot chưa trôi qua so với thời gian hiện tại
      if (MMC.storage.isSlotPast(selectedSlot.dateStr, selectedSlot.timeStr)) {
        showFormError('Khung giờ này đã trôi qua so với thời điểm hiện tại của máy. Vui lòng chọn khung giờ khác.');
        renderSlotsForSelectedDay();
        return;
      }

      // Bước 4: Kiểm tra slot chưa bị đặt (cả TAKEN_SLOTS lẫn booking 'upcoming' của cùng mentor)
      if (MMC.storage.isSlotTaken(currentMentor.id, selectedSlot.dateStr, selectedSlot.timeStr)) {
        showFormError('Khung giờ này vừa có người đặt hoặc đã kín lịch. Vui lòng chọn khung giờ khác.');
        renderSlotsForSelectedDay();
        return;
      }

      // Bước 5: Kiểm tra người học chưa có lịch hẹn khác trùng ngày và giờ đó (với bất kỳ cố vấn nào)
      if (MMC.storage.hasMenteeConflict(selectedSlot.dateStr, selectedSlot.timeStr)) {
        showFormError('Bạn đã có lịch hẹn khác vào khung giờ này. Vui lòng chọn một khung giờ không bị trùng lịch.');
        return;
      }

      // Vô hiệu hóa nút để chống bấm đúp
      isSubmitting = true;
      submitBookingBtn.disabled = true;
      submitBookingBtn.textContent = 'Đang xử lý đặt lịch...';

      // Tạo booking qua storage.js
      const result = MMC.storage.addBooking({
        mentorId: currentMentor.id,
        mentorName: currentMentor.name,
        date: selectedSlot.dateStr,
        time: selectedSlot.timeStr,
        topic: topicVal,
        note: noteInput.value.trim()
      });

      if (!result.success) {
        isSubmitting = false;
        submitBookingBtn.disabled = false;
        submitBookingBtn.innerHTML = '<span aria-hidden="true">✔</span> Xác nhận đặt lịch';
        showFormError(result.error || 'Có lỗi xảy ra khi lưu lịch hẹn. Vui lòng thử lại.');
        return;
      }

      // Đặt lịch thành công!
      const newBooking = result.booking;

      // 1. Cập nhật slot vừa đặt sang trạng thái "Đã kín"
      renderSlotsForSelectedDay();

      // 2. Reset form
      bookingForm.reset();
      topicCharCount.textContent = '0/100';
      noteCharCount.textContent = '0/300';
      selectedSlot = null;
      slotSummaryEmpty.style.display = 'block';
      slotSummarySelected.style.display = 'none';

      // 3. Khôi phục nút submit
      isSubmitting = false;
      submitBookingBtn.disabled = true;
      submitBookingBtn.innerHTML = '<span aria-hidden="true">✔</span> Xác nhận đặt lịch';

      // 4. Cập nhật Badge trên Navbar
      MMC.updateNavBadge();

      // 5. Hiển thị Toast thông báo
      MMC.showToast('Đặt lịch hẹn thành công!', 'success');

      // 6. Hiển thị Modal chi tiết thành công (với focus trap)
      document.getElementById('modal-booking-id').textContent = newBooking.id;
      document.getElementById('modal-mentor-name').textContent = newBooking.mentorName;
      document.getElementById('modal-datetime').textContent = `${MMC.utils.formatDisplayDate(newBooking.date)} (${MMC.utils.formatTimeSlot(newBooking.time)})`;
      document.getElementById('modal-topic').textContent = newBooking.topic;
      const meetLinkEl = document.getElementById('modal-meeting-link');
      meetLinkEl.textContent = newBooking.meetingLink;
      meetLinkEl.href = newBooking.meetingLink;

      MMC.openModal(successModal, submitBookingBtn);
    });
  }

  // Khởi động khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  MMC.profile = {
    init
  };

  window.MMC = MMC;
})(window);
