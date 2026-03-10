const photos = [
    {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000',
        title: 'Serene Peaks',
        category: 'Nature'
    },
    {
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000',
        title: 'Morning Dew',
        category: 'Landscape'
    },
    {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000',
        title: 'Forest Whispers',
        category: 'Nature'
    },
    {
        url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000',
        title: 'Crimson Sky',
        category: 'Landscape'
    },
    {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
        title: 'Alpine Stillness',
        category: 'Adventure'
    },
    {
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
        
        galleryGrid.appendChild(photoItem);
    });
}

document.addEventListener('DOMContentLoaded', initGallery);

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
