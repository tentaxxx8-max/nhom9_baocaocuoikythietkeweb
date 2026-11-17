/**
 * CÁC THÀNH PHẦN VÀ XỬ LÝ GIAO DIỆN DÙNG CHUNG (COMMON COMPONENTS)
 * Bao gồm: Navbar, Badge đếm lịch sắp tới, Toast thông báo, Modal quản lý focus trap
 * Namespace: window.MMC
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};

  // Lưu trữ phần tử kích hoạt modal để trả focus sau khi đóng
  let lastActiveElementBeforeModal = null;
  let currentOpenModal = null;

  /**
   * Cập nhật số lượng lịch hẹn sắp tới trên Badge ở thanh điều hướng
   */
  function updateNavBadge() {
    const badgeElements = document.querySelectorAll('.js-nav-upcoming-badge');
    if (!badgeElements || badgeElements.length === 0) return;

    let count = 0;
    if (MMC.storage && typeof MMC.storage.countUpcomingBookings === 'function') {
      count = MMC.storage.countUpcomingBookings();
    }

    badgeElements.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('c-nav__badge--empty');
        badge.setAttribute('aria-label', `${count} buổi hẹn sắp tới`);
      } else {
        badge.classList.add('c-nav__badge--empty');
        badge.removeAttribute('aria-label');
      }
    });
  }

  /**
   * Khởi tạo menu hamburger trên thiết bị di động
   */
  function initMobileMenu() {
    const hamburgerBtn = document.querySelector('.js-hamburger-btn');
    const navMenu = document.querySelector('.js-nav-menu');

    if (!hamburgerBtn || !navMenu) return;

    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('c-nav--open');
    });

    // Đóng menu khi bấm ra ngoài
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('c-nav--open')) {
        navMenu.classList.remove('c-nav--open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Đánh dấu trang hiện tại trên thanh điều hướng (Active Link)
   */
  function highlightActiveNavLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.c-nav__link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isHome = (href === 'index.html' || href === './') && 
                     (currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('.html'));
      const isBookings = href.includes('my-bookings.html') && currentPath.includes('my-bookings.html');

      if (isHome || isBookings) {
        link.classList.add('c-nav__link--active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('c-nav__link--active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Hệ thống thông báo Toast (Thay thế hoàn toàn alert)
   * Có aria-live để máy đọc màn hình đọc được.
   * 
   * @param {string} message Nội dung thông báo
   * @param {'info'|'success'|'warning'|'error'} type Loại thông báo
   * @param {number} duration Thời gian hiển thị (ms)
   */
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('mmc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mmc-toast-container';
      container.className = 'c-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `c-toast c-toast--${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'warning') icon = '🔔';

    toast.innerHTML = `
      <span class="c-toast__icon" aria-hidden="true">${icon}</span>
      <div class="c-toast__content">${MMC.utils.escapeHTML(message)}</div>
    `;

    container.appendChild(toast);

    // Tự động gỡ sau duration ms
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, duration);
  }

  /**
   * Lấy danh sách các phần tử có thể nhận focus trong một vùng DOM
   * @param {HTMLElement} element
   * @returns {Array<HTMLElement>}
   */
  function getFocusableElements(element) {
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(element.querySelectorAll(selector)).filter(el => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });
  }

  /**
   * Mở modal bất kỳ với Focus Trap và quản lý phím Escape
   * @param {HTMLElement|string} modalTarget Phần tử hoặc ID của modal backdrop
   * @param {HTMLElement} [triggerElement] Phần tử kích hoạt mở modal
   */
  function openModal(modalTarget, triggerElement = null) {
    const backdrop = typeof modalTarget === 'string' ? document.getElementById(modalTarget) : modalTarget;
    if (!backdrop) return;

    lastActiveElementBeforeModal = triggerElement || document.activeElement;
    currentOpenModal = backdrop;

    backdrop.classList.add('c-modal-backdrop--open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền

    // Tìm và focus vào phần tử tương tác đầu tiên hoặc nút đóng
    setTimeout(() => {
      const focusables = getFocusableElements(backdrop);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }, 50);
  }

  /**
   * Đóng modal đang mở và hoàn trả focus
   * @param {HTMLElement|string} modalTarget
   */
  function closeModal(modalTarget) {
    const backdrop = typeof modalTarget === 'string' ? document.getElementById(modalTarget) : modalTarget;
    if (!backdrop) return;

    backdrop.classList.remove('c-modal-backdrop--open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (currentOpenModal === backdrop) {
      currentOpenModal = null;
    }

    // Trả lại tiêu điểm (focus) cho phần tử kích hoạt trước đó
    if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
      lastActiveElementBeforeModal.focus();
      lastActiveElementBeforeModal = null;
    }
  }

  /**
   * Đăng ký sự kiện toàn cục cho modal (Bấm Escape để đóng, bấm ngoài backdrop để đóng, Focus Trap)
   */
  function initGlobalModalListeners() {
    // Lắng nghe phím Escape và Tab (Focus trap)
    document.addEventListener('keydown', (e) => {
      if (!currentOpenModal) return;

      if (e.key === 'Escape' || e.keyCode === 27) {
        closeModal(currentOpenModal);
        return;
      }

      if (e.key === 'Tab' || e.keyCode === 9) {
        const focusables = getFocusableElements(currentOpenModal);
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else { // Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Lắng nghe click vào backdrop hoặc nút có thuộc tính data-close-modal
    document.addEventListener('click', (e) => {
      if (!currentOpenModal) return;

      // Bấm vào nền backdrop (ngoài hộp thoại modal)
      if (e.target === currentOpenModal) {
        closeModal(currentOpenModal);
        return;
      }

      // Bấm nút đóng modal
      const closeTrigger = e.target.closest('[data-close-modal]');
      if (closeTrigger && currentOpenModal.contains(closeTrigger)) {
        closeModal(currentOpenModal);
      }
    });
  }

  /**
   * Modal xác nhận tùy biến (Thay thế hoàn toàn window.confirm)
   * 
   * @param {Object} options
   * @param {string} options.title Tiêu đề
   * @param {string} options.message Nội dung
   * @param {string} [options.confirmText="Xác nhận"]
   * @param {string} [options.cancelText="Hủy bỏ"]
   * @param {boolean} [options.isDanger=false]
   * @param {Function} options.onConfirm Hàm callback khi bấm xác nhận
   * @param {HTMLElement} [options.triggerElement]
   */
  function showConfirmModal(options) {
    const {
      title = 'Xác nhận thao tác',
      message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText = 'Xác nhận',
      cancelText = 'Hủy bỏ',
      isDanger = false,
      onConfirm = () => {},
      triggerElement = null
    } = options;

    let confirmBackdrop = document.getElementById('mmc-confirm-modal');
    if (!confirmBackdrop) {
      confirmBackdrop = document.createElement('div');
      confirmBackdrop.id = 'mmc-confirm-modal';
      confirmBackdrop.className = 'c-modal-backdrop';
      confirmBackdrop.setAttribute('aria-hidden', 'true');
      confirmBackdrop.innerHTML = `
        <div class="c-modal" role="dialog" aria-modal="true" aria-labelledby="mmc-confirm-title">
          <div class="c-modal__header">
            <h3 class="c-modal__title" id="mmc-confirm-title"></h3>
            <button type="button" class="c-modal__close-btn" data-close-modal aria-label="Đóng hộp thoại">✕</button>
          </div>
          <div class="c-modal__body" id="mmc-confirm-body"></div>
          <div class="c-modal__footer">
            <button type="button" class="c-btn c-btn--secondary" data-close-modal id="mmc-confirm-cancel-btn">${MMC.utils.escapeHTML(cancelText)}</button>
            <button type="button" class="c-btn ${isDanger ? 'c-btn--danger' : 'c-btn--primary'}" id="mmc-confirm-action-btn">${MMC.utils.escapeHTML(confirmText)}</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmBackdrop);
    }

    // Cập nhật nội dung
    const titleEl = confirmBackdrop.querySelector('#mmc-confirm-title');
    const bodyEl = confirmBackdrop.querySelector('#mmc-confirm-body');
    const cancelBtn = confirmBackdrop.querySelector('#mmc-confirm-cancel-btn');
    const actionBtn = confirmBackdrop.querySelector('#mmc-confirm-action-btn');

    titleEl.textContent = title;
    bodyEl.innerHTML = `<p>${MMC.utils.escapeHTML(message)}</p>`;
    cancelBtn.textContent = cancelText;
    actionBtn.textContent = confirmText;
    actionBtn.className = `c-btn ${isDanger ? 'c-btn--danger' : 'c-btn--primary'}`;

    // Xử lý sự kiện xác nhận
    const handleConfirm = () => {
      closeModal(confirmBackdrop);
      actionBtn.removeEventListener('click', handleConfirm);
      onConfirm();
    };

    // Gán lại handler
    actionBtn.replaceWith(actionBtn.cloneNode(true));
    const newActionBtn = confirmBackdrop.querySelector('#mmc-confirm-action-btn');
    newActionBtn.addEventListener('click', handleConfirm);

    openModal(confirmBackdrop, triggerElement);
  }

  /**
   * Modal mô phỏng phòng học trực tuyến (Phục vụ nút "Vào phòng học")
   * Thể hiện tầm nhìn phân hệ tích hợp phòng học trực tuyến ở giai đoạn sau.
   * 
   * @param {Object} booking
   * @param {HTMLElement} [triggerElement]
   */
  function showMeetingRoomDemoModal(booking, triggerElement = null) {
    let meetingBackdrop = document.getElementById('mmc-meeting-modal');
    if (!meetingBackdrop) {
      meetingBackdrop = document.createElement('div');
      meetingBackdrop.id = 'mmc-meeting-modal';
      meetingBackdrop.className = 'c-modal-backdrop';
      meetingBackdrop.setAttribute('aria-hidden', 'true');
      meetingBackdrop.innerHTML = `
        <div class="c-modal" role="dialog" aria-modal="true" aria-labelledby="mmc-meeting-title">
          <div class="c-modal__header">
            <h3 class="c-modal__title" id="mmc-meeting-title">
              <span aria-hidden="true">🎥</span> Phòng học trực tuyến (Demo)
            </h3>
            <button type="button" class="c-modal__close-btn" data-close-modal aria-label="Đóng hộp thoại">✕</button>
          </div>
          <div class="c-modal__body" id="mmc-meeting-body"></div>
          <div class="c-modal__footer">
            <button type="button" class="c-btn c-btn--secondary" data-close-modal>Đóng</button>
            <button type="button" class="c-btn c-btn--primary" id="mmc-meeting-copy-btn">
              <span aria-hidden="true">📋</span> Sao chép link
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(meetingBackdrop);
    }

    const bodyEl = meetingBackdrop.querySelector('#mmc-meeting-body');
    const copyBtn = meetingBackdrop.querySelector('#mmc-meeting-copy-btn');

    bodyEl.innerHTML = `
      <div class="l-flex-col l-gap-3">
        <p><strong>Cố vấn:</strong> ${MMC.utils.escapeHTML(booking.mentorName)}</p>
        <p><strong>Thời gian:</strong> ${MMC.utils.formatDisplayDate(booking.date)} (${MMC.utils.formatTimeSlot(booking.time)})</p>
        <p><strong>Chủ đề:</strong> ${MMC.utils.escapeHTML(booking.topic)}</p>
        
        <div style="background-color: var(--color-bg-subtle); padding: var(--spacing-4); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-top: var(--spacing-2);">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: 4px;">Đường dẫn phòng học mẫu:</div>
          <code style="word-break: break-all; color: var(--color-primary); font-weight: bold;">${MMC.utils.escapeHTML(booking.meetingLink || 'https://meet.example.com/mmc-demo')}</code>
        </div>

        <div style="margin-top: var(--spacing-3); font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.5; background-color: var(--color-warning-light); padding: var(--spacing-3); border-radius: var(--radius-md); border-left: 3px solid var(--color-warning);">
          📌 <strong>Lưu ý học phần:</strong> Đây là tính năng mô phỏng thể hiện tầm nhìn dài hạn của phân hệ. Hệ thống phòng học WebRTC trực tuyến kèm bảng vẽ và chia sẻ màn hình sẽ được tích hợp ở giai đoạn tiếp theo.
        </div>
      </div>
    `;

    copyBtn.onclick = () => {
      const link = booking.meetingLink || 'https://meet.example.com/mmc-demo';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
          showToast('Đã sao chép link phòng học vào clipboard!', 'success');
        }).catch(() => {
          showToast('Đã sao chép link phòng học!', 'success');
        });
      } else {
        showToast('Link phòng học: ' + link, 'info');
      }
    };

    openModal(meetingBackdrop, triggerElement);
  }

  // Khởi tạo các thành phần dùng chung khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    highlightActiveNavLink();
    updateNavBadge();
    initGlobalModalListeners();
  });

  // Xuất ra namespace
  MMC.showToast = showToast;
  MMC.openModal = openModal;
  MMC.closeModal = closeModal;
  MMC.showConfirmModal = showConfirmModal;
  MMC.showMeetingRoomDemoModal = showMeetingRoomDemoModal;
  MMC.updateNavBadge = updateNavBadge;

  window.MMC = MMC;
})(window);
