/**
 * LOGIC TRANG CHỦ - TÌM KIẾM VÀ LỌC CỐ VẤN
 * Namespace: window.MMC
 */
(function (window) {
  'use strict';

  const MMC = window.MMC || {};

  // Trạng thái tìm kiếm và bộ lọc hiện thời
  const state = {
    selectedSkill: 'all',
    searchKeyword: '',
    sortBy: 'rating-desc'
  };

  // Các phần tử DOM
  let keywordInput = null;
  let searchForm = null;
  let sortSelect = null;
  let skillChipsContainer = null;
  let mentorListContainer = null;
  let resultsCountEl = null;
  let noResultsStateEl = null;
  let clearFiltersBtn = null;

  /**
   * Khởi tạo giao diện và gắn các bộ lắng nghe sự kiện
   */
  function init() {
    keywordInput = document.getElementById('keyword-input');
    searchForm = document.getElementById('search-form');
    sortSelect = document.getElementById('sort-select');
    skillChipsContainer = document.getElementById('skill-chips-container');
    mentorListContainer = document.getElementById('mentor-list-container');
    resultsCountEl = document.getElementById('results-count');
    noResultsStateEl = document.getElementById('no-results-state');
    clearFiltersBtn = document.getElementById('clear-filters-btn');

    if (!mentorListContainer) return;

    renderSkillChips();
    attachEventListeners();
    applyFilterAndRender();
  }

  /**
   * Hiển thị hàng chip kỹ năng (Flexbox Bắt buộc, flex-wrap)
   */
  function renderSkillChips() {
    if (!skillChipsContainer || !Array.isArray(SKILLS)) return;

    let html = `
      <button type="button" 
              class="c-chip ${state.selectedSkill === 'all' ? 'c-chip--active' : ''}" 
              data-skill="all" 
              aria-pressed="${state.selectedSkill === 'all'}">
        ✨ Tất cả kỹ năng
      </button>
    `;

    SKILLS.forEach(skill => {
      const isSelected = state.selectedSkill === skill;
      html += `
        <button type="button" 
                class="c-chip ${isSelected ? 'c-chip--active' : ''}" 
                data-skill="${MMC.utils.escapeHTML(skill)}" 
                aria-pressed="${isSelected}">
          ${MMC.utils.escapeHTML(skill)}
        </button>
      `;
    });

    skillChipsContainer.innerHTML = html;
  }

  /**
   * Đăng ký các sự kiện tương tác
   */
  function attachEventListeners() {
    // 1. Tìm kiếm theo thời gian thực khi gõ (debounce 250ms)
    const handleDebouncedSearch = MMC.utils.debounce((val) => {
      state.searchKeyword = val.trim();
      applyFilterAndRender();
    }, 250);

    keywordInput.addEventListener('input', (e) => {
      handleDebouncedSearch(e.target.value);
    });

    // 2. Submit form tìm kiếm (khi nhấn Enter hoặc bấm nút "Tìm cố vấn")
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.searchKeyword = keywordInput.value.trim();
      applyFilterAndRender();
    });

    // 3. Chọn chip kỹ năng
    skillChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.c-chip');
      if (!chip) return;

      const skill = chip.getAttribute('data-skill');
      if (!skill) return;

      state.selectedSkill = skill;

      // Cập nhật thuộc tính aria-pressed và class
      skillChipsContainer.querySelectorAll('.c-chip').forEach(c => {
        const isCurrent = c === chip;
        c.classList.toggle('c-chip--active', isCurrent);
        c.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      });

      applyFilterAndRender();
    });

    // 4. Chọn sắp xếp
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilterAndRender();
    });

    // 5. Nút xóa bộ lọc khi không có kết quả
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
      });
    }
  }

  /**
   * Đặt lại bộ lọc về mặc định
   */
  function resetFilters() {
    state.selectedSkill = 'all';
    state.searchKeyword = '';
    state.sortBy = 'rating-desc';

    keywordInput.value = '';
    sortSelect.value = 'rating-desc';

    renderSkillChips();
    applyFilterAndRender();
    keywordInput.focus();
  }

  /**
   * Kiểm tra xem kỹ năng có khớp với từ khóa tìm kiếm hoặc chip đang chọn không
   * Để tô nổi bật (highlight pill)
   * @param {string} skill
   * @returns {boolean}
   */
  function isSkillHighlighted(skill) {
    if (!skill) return false;

    // Khớp với chip kỹ năng đang chọn
    if (state.selectedSkill !== 'all' && skill.toLowerCase() === state.selectedSkill.toLowerCase()) {
      return true;
    }

    // Khớp với từ khóa tìm kiếm
    if (state.searchKeyword) {
      const normKeyword = MMC.utils.removeVietnameseDiacritics(state.searchKeyword);
      const normSkill = MMC.utils.removeVietnameseDiacritics(skill);
      if (normKeyword && normSkill.includes(normKeyword)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Lọc và sắp xếp danh sách cố vấn theo tiêu chí
   */
  function getFilteredMentors() {
    if (!Array.isArray(MENTORS)) return [];

    const normKeyword = MMC.utils.removeVietnameseDiacritics(state.searchKeyword);
    const selectedSkillNorm = state.selectedSkill !== 'all' ? MMC.utils.removeVietnameseDiacritics(state.selectedSkill) : null;

    let filtered = MENTORS.filter(mentor => {
      // Điều kiện 1: Khớp chip kỹ năng (AND)
      if (selectedSkillNorm) {
        const hasSkill = (mentor.skills || []).some(s =>
          MMC.utils.removeVietnameseDiacritics(s) === selectedSkillNorm
        );
        if (!hasSkill) return false;
      }

      // Điều kiện 2: Khớp từ khóa tìm kiếm (AND)
      // Tìm trên: Tên, Chức danh, Bio, Kỹ năng (KHÔNG phân biệt hoa/thường, KHÔNG phân biệt dấu tiếng Việt)
      if (normKeyword) {
        const nameNorm = MMC.utils.removeVietnameseDiacritics(mentor.name);
        const titleNorm = MMC.utils.removeVietnameseDiacritics(mentor.title);
        const bioNorm = MMC.utils.removeVietnameseDiacritics(mentor.bio);
        const skillsNorm = (mentor.skills || []).map(s => MMC.utils.removeVietnameseDiacritics(s)).join(' ');

        const isMatch = nameNorm.includes(normKeyword) ||
                        titleNorm.includes(normKeyword) ||
                        bioNorm.includes(normKeyword) ||
                        skillsNorm.includes(normKeyword);

        if (!isMatch) return false;
      }

      return true;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
      if (state.sortBy === 'rating-desc') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (state.sortBy === 'exp-desc') {
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      }
      if (state.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
      }
      return 0;
    });

    return filtered;
  }

  /**
   * Áp dụng bộ lọc và vẽ lại danh sách thẻ
   */
  function applyFilterAndRender() {
    const mentors = getFilteredMentors();

    // Cập nhật dòng đếm kết quả
    if (resultsCountEl) {
      if (mentors.length === 0) {
        resultsCountEl.textContent = 'Không tìm thấy cố vấn nào phù hợp';
      } else {
        resultsCountEl.textContent = `Tìm thấy ${mentors.length} cố vấn chuyên môn sẵn sàng hỗ trợ`;
      }
    }

    // Xử lý Empty State
    if (mentors.length === 0) {
      mentorListContainer.innerHTML = '';
      noResultsStateEl.style.display = 'flex';
      return;
    }

    noResultsStateEl.style.display = 'none';

    // Vẽ danh sách thẻ
    const htmlCards = mentors.map(mentor => {
      // 1. Tạo Avatar (hỗ trợ ảnh đại diện tự thêm hoặc fallback gradient CSS)
      const avatarHTML = MMC.utils.renderAvatarHTML(mentor.name, 'md', mentor.avatar);

      // 2. Tạo Skills Tags dạng pill (kỹ năng đang lọc/tìm được tô nổi bật)
      const skillsHTML = (mentor.skills || []).map(skill => {
        const highlighted = isSkillHighlighted(skill);
        const highlightClass = highlighted ? 'c-skill-tag--highlight' : '';
        return `<span class="c-skill-tag ${highlightClass}">${MMC.utils.escapeHTML(skill)}</span>`;
      }).join('');

      // 3. Tính lịch rảnh gần nhất (bỏ qua slot đã qua/đã kín)
      const nextSlot = MMC.storage.getNextAvailableSlot(mentor);
      let nextSlotHTML = '';
      if (nextSlot) {
        nextSlotHTML = `
          <div class="c-mentor-card__next-slot" title="Khung giờ rảnh gần nhất có thể đặt ngay">
            <span aria-hidden="true">⚡</span>
            <span>Lịch rảnh gần nhất: <strong>${MMC.utils.escapeHTML(nextSlot.displayText)}</strong></span>
          </div>
        `;
      } else {
        nextSlotHTML = `
          <div class="c-mentor-card__next-slot" style="background-color: var(--color-bg-subtle); color: var(--color-text-muted);" title="Cố vấn hiện chưa có lịch trống trong 7 ngày tới">
            <span aria-hidden="true">⏳</span>
            <span>Tạm thời kín lịch trong 7 ngày tới</span>
          </div>
        `;
      }

      // 4. Tạo thẻ Article hoàn chỉnh (Bố cục Flexbox tự co giãn 3/2/1 cột)
      return `
        <div class="c-mentor-card-wrapper">
          <article class="c-mentor-card">
            <!-- Header: Avatar + Tên + Chức danh -->
            <div class="c-mentor-card__header">
              ${avatarHTML}
              <div class="c-mentor-card__info">
                <h3 class="c-mentor-card__name">
                  <a href="mentor-profile.html?id=${encodeURIComponent(mentor.id)}">
                    ${MMC.utils.escapeHTML(mentor.name)}
                  </a>
                </h3>
                <div class="c-mentor-card__title">${MMC.utils.escapeHTML(mentor.title)}</div>
                
                <div class="c-mentor-card__rating-row">
                  <span class="c-star-rating" aria-label="Đánh giá ${mentor.rating} trên 5 sao">
                    <span aria-hidden="true">★</span> ${mentor.rating.toFixed(1)}
                  </span>
                  <span class="c-mentor-card__reviews-count">(${mentor.reviewCount} đánh giá 360°)</span>
                </div>
              </div>
            </div>

            <!-- Meta: Kinh nghiệm & Số buổi đã dạy -->
            <div class="c-mentor-card__meta-row">
              <div class="c-meta-item">
                <span aria-hidden="true">💼</span>
                <span>${mentor.experienceYears} năm kinh nghiệm</span>
              </div>
              <div class="c-meta-item">
                <span aria-hidden="true">🎓</span>
                <span>${mentor.sessionsTaught} buổi đã dạy</span>
              </div>
            </div>

            <!-- Giới thiệu ngắn -->
            <p class="c-mentor-card__bio">${MMC.utils.escapeHTML(mentor.bio)}</p>

            <!-- Nhãn kỹ năng (Skills Tags - Flexbox Bắt buộc) -->
            <div class="c-skill-tags c-mentor-card__skills" aria-label="Kỹ năng chuyên môn">
              ${skillsHTML}
            </div>

            <!-- Footer: Lịch rảnh gần nhất + Nút Xem hồ sơ -->
            <div class="c-mentor-card__footer">
              ${nextSlotHTML}
              <a href="mentor-profile.html?id=${encodeURIComponent(mentor.id)}" class="c-btn c-btn--primary c-btn--full">
                Xem hồ sơ & Đặt lịch
              </a>
            </div>
          </article>
        </div>
      `;
    }).join('');

    mentorListContainer.innerHTML = htmlCards;
    MMC.utils.attachAvatarErrorListeners(mentorListContainer);
  }

  // Khởi động trang chủ khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  MMC.home = {
    init,
    resetFilters
  };

  window.MMC = MMC;
})(window);
