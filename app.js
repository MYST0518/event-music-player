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

// --- State ---
let currentIdx = 0;
let isPlaying = false;

// --- Initialization ---
function init() {
    renderTrackList();
    loadTrack(0);
    
    if (trackCount) trackCount.innerText = `${tracks.length} tracks`;

    // Drawer Toggle
    const handle = document.querySelector('.drawer-handle');
    if (handle) {
        handle.addEventListener('click', () => {
            playlistSection.classList.toggle('active');
        });
    }
}

// --- Player Functions ---
function loadTrack(idx) {
    const track = tracks[idx];
    if (currentTitle) currentTitle.innerText = track.title;
    if (currentArtist) currentArtist.innerText = track.artist;
    audio.src = track.file;
    audio.load(); // iOSでの再生を安定させるために明示的に呼び出し
    
    // Update Active UI in List
    const items = document.querySelectorAll('.track-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === idx);
    });
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack(idx) {
    if (idx !== undefined && idx !== currentIdx) {
        currentIdx = idx;
        loadTrack(currentIdx);
    }
    
    audio.play().then(() => {
        isPlaying = true;
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }).catch(err => {
        console.error("Playback failed:", err);
    });
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
}

function nextTrack() {
    currentIdx = (currentIdx + 1) % tracks.length;
    loadTrack(currentIdx);
    playTrack();
}

function prevTrack() {
    currentIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    loadTrack(currentIdx);
    playTrack();
}

// --- Events ---
if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
}
if (nextBtn) {
    nextBtn.addEventListener('click', nextTrack);
}
if (prevBtn) {
    prevBtn.addEventListener('click', prevTrack);
}

audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const format = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };
    if (currentTimeEl) currentTimeEl.innerText = format(currentTime);
    if (durationEl) durationEl.innerText = format(duration);
});

if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (!isNaN(duration)) {
            audio.currentTime = (clickX / width) * duration;
        }
    });
}

audio.addEventListener('ended', nextTrack);

// --- Render List ---
function renderTrackList() {
    if (!trackList) return;
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

// Start
init();
