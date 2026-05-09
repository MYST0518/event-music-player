// --- Tracks Definition ---
// ※ デプロイ時に /audio フォルダに楽曲を配置することを想定
const tracks = [
    { title: "おとなあそび", artist: "Carnation∗ / Otona", file: "audio/Carnation∗_Otona - おとなあそび.m4a" },
    { title: "In Your Silent Light", artist: "シオン🔥🐲ドラゴニュートP", file: "audio/In Your Silent Light_シオン🔥🐲ドラゴニュートP - シオン.wav" },
    { title: "ありがとうおかあさん", artist: "Yu_My_Love", file: "audio/ありがとうおかあさん_Yu_My_Love - KAiTOP Vst.mp3" },
    { title: "おかあちゃんのカレーライス", artist: "深海魚", file: "audio/おかあちゃんのカレーライス_深海魚 - Toto Fukami.wav" },
    { title: "おかーさんだいすき", artist: "百花", file: "audio/おかーさんだいすき - 百花.wav" },
    { title: "それでいい", artist: "haizancore", file: "audio/それでいい_haizancore - core haizan.wav" },
    { title: "コンパス", artist: "茶トラ", file: "audio/コンパス_茶トラ - 茶トラ-Brown tiger cat music-.wav" },
    { title: "結びなおす", artist: "Liam", file: "audio/結びなおす_Liam - Kiera2.flac" },
    { title: "花びらひらり", artist: "でもん", file: "audio/花びらひらり_でもん - でもん.wav" }
];

// --- DOM Elements ---
const audio = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const progressFill = document.getElementById('progressFill');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackList = document.getElementById('trackList');
const trackCount = document.getElementById('trackCount');
const playlistSection = document.querySelector('.playlist-section');
const visualizer = document.getElementById('visualizer');

// --- State ---
let currentIdx = 0;
let isPlaying = false;

// --- Initialization ---
function init() {
    renderTrackList();
    loadTrack(0);
    createVisualizer();
    
    trackCount.innerText = `${tracks.length} tracks`;

    // Drawer Toggle
    document.querySelector('.drawer-handle').addEventListener('click', () => {
        playlistSection.classList.toggle('active');
    });
}

// --- Player Functions ---
function loadTrack(idx) {
    const track = tracks[idx];
    currentTitle.innerText = track.title;
    currentArtist.innerText = track.artist;
    audio.src = track.file;
    
    // Update Active UI in List
    const items = document.querySelectorAll('.track-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === idx);
    });
}

function playTrack(idx) {
    currentIdx = idx;
    loadTrack(idx);
    audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        visualizer.classList.add('active');
        animateVisualizer();
    }).catch(e => {
        console.log("Auto-play blocked or failed:", e);
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        visualizer.classList.remove('active');
    });
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        visualizer.classList.remove('active');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            visualizer.classList.add('active');
            animateVisualizer();
            isPlaying = true;
        }).catch(e => console.log("Play failed:", e));
    }
}

function nextTrack() {
    currentIdx = (currentIdx + 1) % tracks.length;
    playTrack(currentIdx);
}

function prevTrack() {
    currentIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    playTrack(currentIdx);
}

// --- Visualizer ---
function createVisualizer() {
    const barCount = 12;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        visualizer.appendChild(bar);
    }
}

function animateVisualizer() {
    if (!isPlaying) return;
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        const h = Math.random() * 50 + 10;
        bar.style.height = `${h}px`;
    });
    requestAnimationFrame(animateVisualizer);
}

// --- Events ---
playBtn.addEventListener('click', () => {
    togglePlay();
    if (isPlaying) animateVisualizer();
});
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Time Label
    const format = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };
    currentTimeEl.innerText = format(currentTime);
    durationEl.innerText = format(duration);
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('ended', nextTrack);

// --- Render List ---
function renderTrackList() {
    trackList.innerHTML = tracks.map((track, i) => `
        <div class="track-item" onclick="playTrack(${i})">
            <span class="track-idx">${i + 1}</span>
            <div class="track-meta">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
        </div>
    `).join('');
}

init();
