/**
 * LOGIC TRANG QUẢN LÝ LỊCH HẸN
 * Namespace: window.MMC
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};

  // Tab đang hoạt động: 'upcoming' | 'history'
  let currentTab = 'upcoming';

  // DOM Elements
  let statUpcomingCount = null;
  let statTotalHours = null;
  let statConnectedMentors = null;
  let tabUpcomingBtn = null;
  let tabHistoryBtn = null;
  let tabUpcomingCount = null;
  let tabHistoryCount = null;
  let panelUpcoming = null;
  let panelHistory = null;
  let upcomingListContainer = null;
  let historyListContainer = null;
  let upcomingEmptyState = null;
  let historyEmptyState = null;
  let resetSampleBtn = null;

  /**
   * Khởi tạo trang Quản lý lịch hẹn
   */
  function init() {
    statUpcomingCount = document.getElementById('stat-upcoming-count');
    statTotalHours = document.getElementById('stat-total-hours');
    statConnectedMentors = document.getElementById('stat-connected-mentors');
    tabUpcomingBtn = document.getElementById('tab-upcoming');
    tabHistoryBtn = document.getElementById('tab-history');
    tabUpcomingCount = document.getElementById('tab-upcoming-count');
    tabHistoryCount = document.getElementById('tab-history-count');
    panelUpcoming = document.getElementById('panel-upcoming');
    panelHistory = document.getElementById('panel-history');
    upcomingListContainer = document.getElementById('upcoming-bookings-list');
    historyListContainer = document.getElementById('history-bookings-list');
    upcomingEmptyState = document.getElementById('upcoming-empty-state');
    historyEmptyState = document.getElementById('history-empty-state');
    resetSampleBtn = document.getElementById('reset-sample-btn');

    if (!upcomingListContainer) return;

    attachEventListeners();
    renderAll();
  }

  /**
   * Gắn các sự kiện chuyển tab và đặt lại dữ liệu
   */
  function attachEventListeners() {
    // Chuyển sang tab Sắp tới
    tabUpcomingBtn.addEventListener('click', () => {
      switchTab('upcoming');
    });

    // Chuyển sang tab Lịch sử
    tabHistoryBtn.addEventListener('click', () => {
      switchTab('history');
    });

    // Nút Đặt lại dữ liệu mẫu (có modal xác nhận, không dùng confirm)
    if (resetSampleBtn) {
      resetSampleBtn.addEventListener('click', () => {
        MMC.showConfirmModal({
          title: 'Đặt lại dữ liệu mẫu ban đầu?',
          message: 'Hệ thống sẽ làm mới danh sách lịch hẹn về 2 buổi hẹn mẫu sắp tới tính theo ngày hiện tại của máy. Mọi lịch hẹn bạn vừa đặt sẽ được xóa và đặt lại.',
          confirmText: 'Đặt lại dữ liệu',
          cancelText: 'Giữ nguyên',
          isDanger: true,
          triggerElement: resetSampleBtn,
          onConfirm: () => {
            MMC.storage.resetSampleData();
            renderAll();
            MMC.updateNavBadge();
            MMC.showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
          }
        });
      });
    }
  }

  /**
   * Chuyển tab giữa "Sắp tới" và "Lịch sử"
   * @param {'upcoming'|'history'} tabName
   */
  function switchTab(tabName) {
    currentTab = tabName;

    const isUpcoming = tabName === 'upcoming';
    tabUpcomingBtn.classList.toggle('c-booking-tab--active', isUpcoming);
    tabUpcomingBtn.setAttribute('aria-selected', isUpcoming ? 'true' : 'false');
    panelUpcoming.style.display = isUpcoming ? 'block' : 'none';

    tabHistoryBtn.classList.toggle('c-booking-tab--active', !isUpcoming);
    tabHistoryBtn.setAttribute('aria-selected', !isUpcoming ? 'true' : 'false');
    panelHistory.style.display = !isUpcoming ? 'block' : 'none';
  }

  /**
   * Phân loại và lấy danh sách các booking
   * Logic: Nếu booking có status 'upcoming' nhưng thời điểm kết thúc đã qua -> tự coi là 'completed' và xếp vào lịch sử!
   */
  function categorizeBookings() {
    const rawBookings = MMC.storage.getBookings();
    const now = new Date();

    const upcoming = [];
    const history = [];

    rawBookings.forEach(item => {
      const endDateTime = MMC.utils.getSlotEndDateTime(item.date, item.time);
      const isEnded = now >= endDateTime;

      if (item.status === 'cancelled') {
        history.push({
          ...item,
          displayStatus: 'cancelled',
          statusLabel: 'Đã hủy',
          badgeClass: 'c-badge--cancelled'
        });
      } else if (item.status === 'upcoming') {
        if (isEnded) {
          // Tự động chuyển thành Đã hoàn thành lúc render
          history.push({
            ...item,
            displayStatus: 'completed',
            statusLabel: 'Đã hoàn thành',
            badgeClass: 'c-badge--completed'
          });
        } else {
          upcoming.push({
            ...item,
            displayStatus: 'upcoming',
            statusLabel: 'Sắp diễn ra',
            badgeClass: 'c-badge--upcoming'
          });
        }
      }
    });

    // Sắp xếp: "Sắp tới" tăng dần theo thời gian bắt đầu
    upcoming.sort((a, b) => {
      const tA = MMC.utils.getSlotStartDateTime(a.date, a.time).getTime();
      const tB = MMC.utils.getSlotStartDateTime(b.date, b.time).getTime();
      return tA - tB;
    });

    // Sắp xếp: "Lịch sử" giảm dần theo thời gian (mới nhất lên trước)
    history.sort((a, b) => {
      const tA = MMC.utils.getSlotStartDateTime(a.date, a.time).getTime();
      const tB = MMC.utils.getSlotStartDateTime(b.date, b.time).getTime();
      return tB - tA;
    });

    return { upcoming, history };
  }

  /**
   * Cập nhật 3 thẻ thống kê tổng quan
   */
  function updateStatistics(upcoming, history) {
    // 1. Số buổi sắp tới
    statUpcomingCount.textContent = upcoming.length;
    tabUpcomingCount.textContent = upcoming.length;
    tabHistoryCount.textContent = history.length;

    // 2. Tổng số giờ đã đặt (1 giờ mỗi slot cho tất cả các buổi không bị hủy)
    const completedCount = history.filter(h => h.displayStatus === 'completed').length;
    const totalHours = upcoming.length + completedCount;
    statTotalHours.textContent = `${totalHours} giờ`;

    // 3. Số cố vấn đã kết nối (tính unique mentorId)
    const validBookings = [...upcoming, ...history.filter(h => h.displayStatus === 'completed')];
    const uniqueMentorIds = new Set(validBookings.map(b => b.mentorId));
    statConnectedMentors.textContent = uniqueMentorIds.size;
  }

  /**
   * Hiển thị danh sách các buổi hẹn sắp tới
   */
  function renderUpcomingList(upcoming) {
    if (upcoming.length === 0) {
      upcomingListContainer.innerHTML = '';
      upcomingEmptyState.style.display = 'flex';
      return;
    }

    upcomingEmptyState.style.display = 'none';

    const html = upcoming.map(b => {
      const mentor = (typeof MENTORS !== 'undefined' && Array.isArray(MENTORS))
        ? MENTORS.find(m => m.id === b.mentorId)
        : null;
      const avatarUrl = mentor ? mentor.avatar : null;
      const avatarHTML = MMC.utils.renderAvatarHTML(b.mentorName, 'md', avatarUrl);
      const dateDisplay = MMC.utils.formatDisplayDate(b.date, true, true);
      const timeDisplay = MMC.utils.formatTimeSlot(b.time);
      const countdown = MMC.utils.getRelativeTimeCountdown(b.date, b.time);

      let noteHTML = '';
      if (b.note) {
        noteHTML = `
          <div class="c-booking-card__note">
            <span aria-hidden="true">💬</span> <strong>Ghi chú:</strong> ${MMC.utils.escapeHTML(b.note)}
          </div>
        `;
      }

      return `
        <article class="c-booking-card" id="booking-item-${b.id}">
          <div class="c-booking-card__main">
            <!-- Header cố vấn -->
            <div class="l-flex l-items-center l-gap-3" style="margin-bottom: var(--spacing-3);">
              ${avatarHTML}
              <div>
                <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); line-height: 1.2;">
                  <a href="mentor-profile.html?id=${encodeURIComponent(b.mentorId)}" title="Xem hồ sơ cố vấn">
                    ${MMC.utils.escapeHTML(b.mentorName)}
                  </a>
                </h2>
                <span class="c-badge ${b.badgeClass}" style="margin-top: 4px;">
                  <span aria-hidden="true">🟢</span> ${b.statusLabel}
                </span>
              </div>
            </div>

            <!-- Thời gian & Đếm ngược -->
            <div class="c-booking-card__time-badge">
              <span aria-hidden="true">📅</span>
              <span>${dateDisplay} • <strong>${timeDisplay}</strong></span>
            </div>

            <div class="c-booking-card__countdown">
              <span aria-hidden="true">⏰</span> ${countdown}
            </div>

            <!-- Chủ đề & Ghi chú -->
            <div class="c-booking-card__topic" style="margin-top: var(--spacing-2);">
              🎯 <strong>Chủ đề:</strong> ${MMC.utils.escapeHTML(b.topic)}
            </div>
            ${noteHTML}
          </div>

          <!-- Các nút hành động -->
          <div class="c-booking-card__actions">
            <button type="button" 
                    class="c-btn c-btn--primary js-join-room-btn" 
                    data-booking-id="${b.id}">
              <span aria-hidden="true">🎥</span> Vào phòng học
            </button>
            <button type="button" 
                    class="c-btn c-btn--danger-outline c-btn--sm js-cancel-booking-btn" 
                    data-booking-id="${b.id}"
                    data-mentor-name="${MMC.utils.escapeHTML(b.mentorName)}"
                    data-date="${b.date}"
                    data-time="${b.time}">
              <span aria-hidden="true">✕</span> Hủy lịch hẹn
            </button>
          </div>
        </article>
      `;
    }).join('');

    upcomingListContainer.innerHTML = html;
    MMC.utils.attachAvatarErrorListeners(upcomingListContainer);

    // Gắn sự kiện các nút
    attachCardActionListeners(upcoming);
  }

  /**
   * Hiển thị danh sách lịch sử
   */
  function renderHistoryList(history) {
    if (history.length === 0) {
      historyListContainer.innerHTML = '';
      historyEmptyState.style.display = 'flex';
      return;
    }

    historyEmptyState.style.display = 'none';

    const html = history.map(b => {
      const mentor = (typeof MENTORS !== 'undefined' && Array.isArray(MENTORS))
        ? MENTORS.find(m => m.id === b.mentorId)
        : null;
      const avatarUrl = mentor ? mentor.avatar : null;
      const avatarHTML = MMC.utils.renderAvatarHTML(b.mentorName, 'md', avatarUrl);
      const dateDisplay = MMC.utils.formatDisplayDate(b.date, true, true);
      const timeDisplay = MMC.utils.formatTimeSlot(b.time);

      let statusIcon = b.displayStatus === 'completed' ? '✔' : '✕';

      let noteHTML = '';
      if (b.note) {
        noteHTML = `
          <div class="c-booking-card__note">
            <span aria-hidden="true">💬</span> <strong>Ghi chú:</strong> ${MMC.utils.escapeHTML(b.note)}
          </div>
        `;
      }

      return `
        <article class="c-booking-card" style="opacity: 0.85;">
          <div class="c-booking-card__main">
            <div class="l-flex l-items-center l-gap-3" style="margin-bottom: var(--spacing-3);">
              ${avatarHTML}
              <div>
                <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); line-height: 1.2;">
                  <a href="mentor-profile.html?id=${encodeURIComponent(b.mentorId)}">
                    ${MMC.utils.escapeHTML(b.mentorName)}
                  </a>
                </h2>
                <span class="c-badge ${b.badgeClass}" style="margin-top: 4px;">
                  <span aria-hidden="true">${statusIcon}</span> ${b.statusLabel}
                </span>
              </div>
            </div>

            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--spacing-2);">
              <span aria-hidden="true">📅</span> ${dateDisplay} (${timeDisplay})
            </div>

            <div class="c-booking-card__topic">
              🎯 <strong>Chủ đề:</strong> ${MMC.utils.escapeHTML(b.topic)}
            </div>
            ${noteHTML}
          </div>

          <div class="c-booking-card__actions">
            <a href="mentor-profile.html?id=${encodeURIComponent(b.mentorId)}" class="c-btn c-btn--outline c-btn--sm">
              Xem lại hồ sơ
            </a>
          </div>
        </article>
      `;
    }).join('');

    historyListContainer.innerHTML = html;
    MMC.utils.attachAvatarErrorListeners(historyListContainer);
  }

  /**
   * Gắn sự kiện cho các nút hành động trong thẻ lịch hẹn
   */
  function attachCardActionListeners(upcomingBookings) {
    // 1. Nút Vào phòng học (Demo WebRTC)
    upcomingListContainer.querySelectorAll('.js-join-room-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-id');
        const booking = upcomingBookings.find(b => b.id === id);
        if (booking) {
          MMC.showMeetingRoomDemoModal(booking, btn);
        }
      });
    });

    // 2. Nút Hủy lịch hẹn (Có modal xác nhận, không dùng confirm)
    upcomingListContainer.querySelectorAll('.js-cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-id');
        const mentorName = btn.getAttribute('data-mentor-name');
        const date = btn.getAttribute('data-date');
        const time = btn.getAttribute('data-time');

        const dateStr = MMC.utils.formatDisplayDate(date);
        const timeStr = MMC.utils.formatTimeSlot(time);

        MMC.showConfirmModal({
          title: 'Xác nhận hủy buổi hẹn?',
          message: `Bạn có chắc chắn muốn hủy lịch hẹn với cố vấn ${mentorName} vào lúc ${timeStr}, ${dateStr}? Khung giờ này sẽ lập tức được giải phóng để người khác hoặc bạn có thể đặt lại.`,
          confirmText: 'Đồng ý hủy',
          cancelText: 'Giữ lại lịch',
          isDanger: true,
          triggerElement: btn,
          onConfirm: () => {
            const success = MMC.storage.cancelBooking(id);
            if (success) {
              renderAll();
              MMC.updateNavBadge();
              MMC.showToast('Đã hủy lịch hẹn thành công. Khung giờ đã được giải phóng.', 'info');
            } else {
              MMC.showToast('Không thể hủy lịch hẹn này. Vui lòng thử lại.', 'error');
            }
          }
        });
      });
    });
  }

  /**
   * Tải lại và hiển thị toàn bộ giao diện
   */
  function renderAll() {
    const { upcoming, history } = categorizeBookings();
    updateStatistics(upcoming, history);
    renderUpcomingList(upcoming);
    renderHistoryList(history);
  }

  // Khởi động khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  MMC.bookings = {
    init,
    renderAll
  };

  window.MMC = MMC;
})(window);
