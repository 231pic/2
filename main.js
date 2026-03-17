const photos = [
    { id: 'photo-1', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000', title: 'Serene Peaks', category: 'Nature' },
    { id: 'photo-2', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000', title: 'Morning Dew', category: 'Landscape' },
    { id: 'photo-3', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000', title: 'Forest Whispers', category: 'Nature' },
    { id: 'photo-4', url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000', title: 'Crimson Sky', category: 'Landscape' },
    { id: 'photo-5', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000', title: 'Alpine Stillness', category: 'Adventure' },
    { id: 'photo-6', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1000', title: 'Golden Hour', category: 'Architecture' }
];

let currentSlideIndex = 0;
let currentMode = 'slide';

function initGallery() {
    const galleryTrack = document.getElementById('analogTrack');
    if (!galleryTrack) return;

    galleryTrack.innerHTML = '';
    photos.forEach((photo) => {
        const slide = document.createElement('div');
        slide.className = 'analog-slide';
        
        slide.innerHTML = `
            <div class="analog-polaroid">
                <div class="analog-tape"></div>
                <img src="${photo.url}" alt="${photo.title}" onload="this.classList.add('loaded')">
                <div class="analog-caption">${photo.title}</div>
            </div>
        `;
        
        slide.querySelector('.analog-polaroid').addEventListener('click', () => openPhotoDetail(photo));
        galleryTrack.appendChild(slide);
    });
}

window.setAnalogMode = function(mode) {
    currentMode = mode;
    const viewport = document.getElementById('analogViewport');
    const track = document.getElementById('analogTrack');
    const btnSlide = document.getElementById('btnSlide');
    const btnBoard = document.getElementById('btnBoard');
    const navBtns = document.querySelectorAll('.analog-nav-btn');

    if (mode === 'slide') {
        viewport.classList.remove('is-board');
        track.classList.remove('is-board');
        btnSlide.classList.add('active');
        btnBoard.classList.remove('active');
        navBtns.forEach(btn => btn.style.display = 'block');
        updateSlidePosition();
    } else {
        viewport.classList.add('is-board');
        track.classList.add('is-board');
        btnBoard.classList.add('active');
        btnSlide.classList.remove('active');
        navBtns.forEach(btn => btn.style.display = 'none');
        track.style.transform = 'none';
    }
}

window.moveAnalogSlide = function(direction) {
    if (currentMode !== 'slide') return;
    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = photos.length - 1;
    if (currentSlideIndex >= photos.length) currentSlideIndex = 0;
    updateSlidePosition();
}

function updateSlidePosition() {
    const track = document.getElementById('analogTrack');
    const offset = -currentSlideIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function openPhotoDetail(photo) {
    const detailSection = document.getElementById('photo-detail');
    const detailImg = document.getElementById('detail-img');
    const detailTitle = document.getElementById('detail-title');
    const detailCategory = document.getElementById('detail-category');

    detailImg.src = photo.url;
    detailTitle.textContent = photo.title;
    detailCategory.textContent = photo.category;
    detailSection.style.display = 'flex';
    
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

document.querySelector('.close-detail')?.addEventListener('click', () => {
    document.getElementById('photo-detail').style.display = 'none';
});

function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');
    let entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
    
    function renderEntries() {
        entriesContainer.innerHTML = entries.map(entry => `
            <div class="gb-entry">
                <strong>${entry.name}</strong>
                <p>${entry.message}</p>
                <small>${new Date(entry.date).toLocaleString()}</small>
            </div>
        `).reverse().join('');
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('gb-name').value;
        const message = document.getElementById('gb-message').value;
        const newEntry = { name, message, date: new Date().toISOString() };
        entries.push(newEntry);
        localStorage.setItem('guestbook_entries', JSON.stringify(entries));
        form.reset();
        renderEntries();
    });

    renderEntries();
}

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1200);
});

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initGuestbook();
    setAnalogMode('slide');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
