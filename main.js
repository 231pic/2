const photos = [
    {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000',
        title: 'Serene Peaks',
        category: 'Nature'
    },
    {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000',
        title: 'Morning Dew',
        category: 'Landscape'
    },
    {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000',
        title: 'Forest Whispers',
        category: 'Nature'
    },
    {
        id: 'photo-4',
        url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000',
        title: 'Crimson Sky',
        category: 'Landscape'
    },
    {
        id: 'photo-5',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
        title: 'Alpine Stillness',
        category: 'Adventure'
    },
    {
        id: 'photo-6',
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1000',
        title: 'Golden Hour',
        category: 'Architecture'
    }
];

function initGallery() {
    const galleryGrid = document.getElementById('photo-gallery');
    if (!galleryGrid) return;

    photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            <div class="photo-overlay">
                <h3>${photo.title}</h3>
                <p>${photo.category}</p>
            </div>
        `;
        photoItem.addEventListener('click', () => openPhotoDetail(photo));
        galleryGrid.appendChild(photoItem);
    });
}

function openPhotoDetail(photo) {
    const detailSection = document.getElementById('photo-detail');
    const detailImg = document.getElementById('detail-img');
    const detailTitle = document.getElementById('detail-title');
    const detailCategory = document.getElementById('detail-category');

    detailImg.src = photo.url;
    detailTitle.textContent = photo.title;
    detailCategory.textContent = photo.category;
    detailSection.style.display = 'block';
    
    // Scroll to detail view
    detailSection.scrollIntoView({ behavior: 'smooth' });

    // Reload Disqus for this specific photo
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

// Close detail view
document.querySelector('.close-detail')?.addEventListener('click', () => {
    document.getElementById('photo-detail').style.display = 'none';
});

/* Guestbook Logic */
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');

    // Load existing entries
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

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initGuestbook();
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
