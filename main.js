// 17장의 사진 데이터를 생성합니다. (파일명: pic (1).jpg ~ pic (17).jpg)
const photos = [];
for (let i = 1; i <= 17; i++) {
    photos.push({
        id: `photo-${i}`,
        // 파일명에 공백과 괄호가 포함된 경우를 위해 URL 인코딩 처리를 고려합니다.
        // 일부 파일이 .JPG(대문자)로 되어 있는 경우를 위해 조건부로 경로를 생성합니다.
        url: (i === 14) ? `pic (${i}).JPG` : `pic (${i}).jpg`, 
        title: `Shot on A7M3`,
        category: 'Exhibition'
    });
}

let currentSlide = 0;
let isGridMode = false;
let slideInterval;

function init() {
    initCursor();
    initPreloader();
    initGallery();
    initGuestbook();
    initBGM(); // BGM 기능 초기화
    setViewMode('slider');
}

function initCursor() {
    const cursor = document.getElementById('cursor');
    // Detect if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

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

function initGallery() {
    const track = document.getElementById('sliderTrack');
    track.innerHTML = '';
    
    photos.forEach((photo) => {
        const slide = document.createElement('div');
        slide.className = 'slide hovered-area';
        slide.innerHTML = `
            <div class="polaroid">
                <div class="tape"></div>
                <img src="${encodeURIComponent(photo.url)}" alt="${photo.title}" onload="this.classList.add('loaded')">
                <div class="polaroid-caption">${photo.title}</div>
            </div>
        `;
        slide.addEventListener('click', () => openPhotoDetail(photo));
        track.appendChild(slide);
    });

    // Touch events for slider
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (isGridMode) return;
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            changeSlide(1); // Swipe left -> next slide
        } else if (touchEndX - touchStartX > swipeThreshold) {
            changeSlide(-1); // Swipe right -> prev slide
        }
    }
}

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

window.openModal = function(id) {
    closeAllModals();
    document.getElementById(id).classList.add('active');
}

window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function openPhotoDetail(photo) {
    const modal = document.getElementById('photoDetailModal');
    const img = document.getElementById('detailImg');
    const title = document.getElementById('detailTitle');
    const category = document.getElementById('detailCategory');

    img.src = encodeURIComponent(photo.url);
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

// BGM 기능 구현
function initBGM() {
    const bgmAudio = new Audio('lofi.mp3');
    bgmAudio.loop = true;
    const bgmToggle = document.getElementById('bgmToggle');
    let isPlaying = false;

    bgmToggle?.addEventListener('click', () => {
        if (isPlaying) {
            bgmAudio.pause();
            bgmToggle.innerText = 'PLAY SOUND';
        } else {
            bgmAudio.play();
            bgmToggle.innerText = 'PAUSE SOUND';
        }
        isPlaying = !isPlaying;
    });
}

document.addEventListener('DOMContentLoaded', init);
