const koreanHipHopData = {
    2023: [
        { title: '파이팅 해야지', artist: '부석순 (SEVENTEEN)' },
        { title: 'Smoke (Prod. Dynamicduo, Padi)', artist: '다이나믹 듀오' },
        { title: 'I Don\'t Think That I Like Her', artist: 'Charlie Puth' },
    ],
    2022: [
        { title: 'LOVE DIVE', artist: 'IVE (아이브)' },
        { title: 'TOMBOY', artist: '(G)I-DLE' },
        { title: 'That That (prod. & feat. SUGA of BTS)', artist: 'PSY' },
    ],
    2021: [
        { title: 'Next Level', artist: 'aespa' },
        { title: 'Butter', artist: 'BTS' },
        { title: '신호등', artist: '이무진' },
    ],
};

function displaySongsByYear() {
    for (const year in koreanHipHopData) {
        const container = document.getElementById(`year-${year}`);
        if (container) {
            const songs = koreanHipHopData[year];
            songs.forEach(song => {
                const item = document.createElement('div');
                item.classList.add('recommendation-item');
                item.innerHTML = `
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                `;
                container.appendChild(item);
            });
        }
    }
}

displaySongsByYear();
