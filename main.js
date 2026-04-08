// 17장의 사진 데이터를 생성합니다. (파일명: pic (1).jpg ~ pic (17).jpg)
const photos = [];
for (let i = 1; i <= 17; i++) {
    photos.push({
        id: `photo-${i}`,
        url: (i === 14) ? `pic (${i}).JPG` : `pic (${i}).jpg`, 
        title: `Shot on A7M3`,
        category: 'Exhibition'
    });
}

let currentSlide = 0;
let isGridMode = false;
let slideInterval;
let database;

// Firebase 설정 (사용자 정보로 교체 필요)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "231pic-2.firebaseapp.com",
    databaseURL: "https://231pic-2-default-rtdb.firebaseio.com",
    projectId: "231pic-2",
    storageBucket: "231pic-2.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

function init() {
    initFirebase();
    initCursor();
    initPreloader();
    initGallery();
    initGuestbook();
    initBGM(); 
    initDarkMode();
    initKeyboardNav();
    setViewMode('slider');
}

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            database = firebase.database();
        }
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
}

function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // 모달이 열려있을 때 ESC로 닫기
        if (e.key === 'Escape') {
            closeAllModals();
            return;
        }

        // 슬라이드 모드일 때 화살표 키 네비게이션
        if (!isGridMode) {
            if (e.key === 'ArrowRight') changeSlide(1);
            if (e.key === 'ArrowLeft') changeSlide(-1);
        }
    });
}

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (toggle) toggle.innerText = 'LIGHTS ON';
    }

    toggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        toggle.innerText = isDark ? 'LIGHTS ON' : 'LIGHTS OFF';
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
}

function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

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
    if (!track) return;
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
        if (touchStartX - touchEndX > swipeThreshold) changeSlide(1);
        else if (touchEndX - touchStartX > swipeThreshold) changeSlide(-1);
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
        viewport?.classList.add('grid-mode');
        track?.classList.add('grid-mode');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        btnSlider?.classList.remove('active');
        btnGrid?.classList.add('active');
        clearInterval(slideInterval);
    } else {
        isGridMode = false;
        viewport?.classList.remove('grid-mode');
        track?.classList.remove('grid-mode');
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
        btnSlider?.classList.add('active');
        btnGrid?.classList.remove('active');
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
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        if (i === currentSlide) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetAutoSlide() {
    startAutoSlide();
}

window.openModal = function(id) {
    closeAllModals();
    document.getElementById(id)?.classList.add('active');
}

window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function openPhotoDetail(photo) {
    const modal = document.getElementById('photoDetailModal');
    const img = document.getElementById('detailImg');
    const title = document.getElementById('detailTitle');
    const category = document.getElementById('detailCategory');

    if (img) img.src = encodeURIComponent(photo.url);
    if (title) title.innerText = photo.title;
    if (category) category.innerText = photo.category;
    
    modal?.classList.add('active');

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

    function render(entriesObj) {
        let entries = [];
        if (entriesObj) {
            entries = Object.values(entriesObj);
        } else {
            entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
        }

        if (container) {
            container.innerHTML = entries.map(e => `
                <div class="gb-entry">
                    <strong>${e.name}</strong>
                    <p>${e.message}</p>
                    <small>${new Date(e.date).toLocaleString()}</small>
                </div>
            `).reverse().join('');
        }
    }

    if (database) {
        database.ref('guestbook').on('value', (snapshot) => {
            render(snapshot.val());
        });
    } else {
        render();
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('gb-name');
        const messageInput = document.getElementById('gb-message');
        const name = nameInput.value;
        const message = messageInput.value;
        const entry = { name, message, date: new Date().toISOString() };

        if (database) {
            database.ref('guestbook').push(entry);
        } else {
            let entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
            entries.push(entry);
            localStorage.setItem('guestbook_entries', JSON.stringify(entries));
            render();
        }
        form.reset();
    });
}

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
