const photos = [
    { id: 'photo-1', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000', title: 'Serene Peaks', category: 'Nature' },
    { id: 'photo-2', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000', title: 'Morning Dew', category: 'Landscape' },
    { id: 'photo-3', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000', title: 'Forest Whispers', category: 'Nature' },
    { id: 'photo-4', url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000', title: 'Crimson Sky', category: 'Landscape' },
    { id: 'photo-5', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000', title: 'Alpine Stillness', category: 'Adventure' },
    { id: 'photo-6', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1000', title: 'Golden Hour', category: 'Architecture' }
];

let currentSlide = 0;
let isGridMode = false;
let slideInterval;

/* 초기화 */
function init() {
    initCursor();
    initPreloader();
    initGallery();
    initGuestbook();
    setViewMode('slider');
}

/* 커스텀 커서 */
function initCursor() {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.hovered-area')) {
            cursor.classList.add('hovered');
            cursor.innerText = 'View';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.hovered-area')) {
            cursor.classList.remove('hovered');
            cursor.innerText = '';
        }
    });
}

/* 프리로더 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressText = document.getElementById('progressText');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 2;
        if (progress >= 99) {
            progress = 99;
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 1000);
            }, 500);
        }
        progressText.innerText = progress.toString().padStart(2, '0');
    }, 50);
}

/* 갤러리 생성 */
function initGallery() {
    const track = document.getElementById('sliderTrack');
    track.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide hovered-area';
        slide.innerHTML = `
            <div class="polaroid">
                <div class="tape"></div>
                <img src="${photo.url}" alt="${photo.title}" onload="this.classList.add('loaded')">
                <div class="polaroid-caption">${photo.title}</div>
            </div>
        `;
        slide.addEventListener('click', () => openPhotoDetail(photo));
        track.appendChild(slide);
    });
}

/* 뷰 모드 전환 */
window.setViewMode = function(mode) {
    const viewport = document.getElementById('viewport');
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const btnSlider = document.getElementById('btnSlider');
    const btnGrid = document.getElementById('btnGrid');

    if (mode === 'grid') {
        isGridMode = true;
        viewport.classList.add('grid-mode');
        track.classList.add('grid-mode');
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        btnSlider.classList.remove('active');
        btnGrid.classList.add('active');
        clearInterval(slideInterval);
    } else {
        isGridMode = false;
        viewport.classList.remove('grid-mode');
        track.classList.remove('grid-mode');
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        btnSlider.classList.add('active');
        btnGrid.classList.remove('active');
        updateSlider();
        startAutoSlide();
    }
}

/* 슬라이더 제어 */
window.changeSlide = function(dir) {
    if (isGridMode) return;
    currentSlide = (currentSlide + dir + photos.length) % photos.length;
    updateSlider();
    resetAutoSlide();
}

function updateSlider() {
    const track = document.getElementById('sliderTrack');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        if (i === currentSlide) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function startAutoSlide() {
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

/* 모달 제어 */
window.openModal = function(id) {
    closeAllModals();
    document.getElementById(id).classList.add('active');
}

window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

/* 사진 상세 및 댓글 */
function openPhotoDetail(photo) {
    const modal = document.getElementById('photoDetailModal');
    const img = document.getElementById('detailImg');
    const title = document.getElementById('detailTitle');
    const category = document.getElementById('detailCategory');

    img.src = photo.url;
    title.innerText = photo.title;
    category.innerText = photo.category;
    
    modal.classList.add('active');

    if (typeof DISQUS !== 'undefined') {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = photo.id;
                this.page.url = window.location.origin + '/#!' + photo.id;
                this.page.title = photo.title;
            }
        });
    }
}

/* 방명록 */
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const container = document.getElementById('guestbook-entries');
    
    function render() {
        let entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
        container.innerHTML = entries.map(e => `
            <div class="gb-entry" style="margin-bottom: 20px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                <strong style="color: #fff; font-size: 0.8rem;">${e.name}</strong>
                <p style="color: #ccc; font-size: 0.95rem; margin: 5px 0;">${e.message}</p>
                <small style="color: #444; font-size: 0.7rem;">${new Date(e.date).toLocaleString()}</small>
            </div>
        `).reverse().join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('gb-name').value;
        const message = document.getElementById('gb-message').value;
        let entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
        entries.push({ name, message, date: new Date().toISOString() });
        localStorage.setItem('guestbook_entries', JSON.stringify(entries));
        form.reset();
        render();
    });

    render();
}

/* BGM (UI만) */
const bgmAudio = document.createElement('audio'); // 오디오 객체 생성만 해둠
const bgmToggle = document.getElementById('bgmToggle');
let isPlaying = false;
bgmToggle?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    bgmToggle.innerText = isPlaying ? 'PAUSE SOUND' : 'PLAY SOUND';
});

document.addEventListener('DOMContentLoaded', init);
