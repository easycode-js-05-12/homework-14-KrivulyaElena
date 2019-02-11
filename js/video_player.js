class VideoPlayerBasic {
  constructor(settings) {
    this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
    this._videoContainer = null;
    this._video = null;
    this._toggleBtn = null;
    this._progress = null;
    this._mouseDown = false;
    this._skipNext = settings.skipNext;
    this._skipPrev = settings.skipPrev;
  }

  init() {
    // Проверить передані ли  видео и контейнер
    if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
    if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
    
    // Создадим разметку и добавим ее на страницу
    this._addTemplate();
    // Найти все элементы управления
    this._setElements();
    // Установить обработчики событий
    this._setEvents();
  }

  toggle() {
    const method = this._video.paused ? 'play' : 'pause';
    this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
    this._video[method]();
  }

  _handlerProgress() {
    const percent = (this._video.currentTime / this._video.duration) * 100;
    this._progress.style.flexBasis = `${percent}%`;
  }

  _scrub(e) {
    this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
  }

  _setElements() {
    this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
    this._video = this._videoContainer.querySelector('video');
    this._toggleBtn = this._videoContainer.querySelector('.toggle');
    this._progress = this._videoContainer.querySelector('.progress__filled');
    this._progressContainer = this._videoContainer.querySelector('.progress');
    this._volumeControl = document.getElementById('volume');
    this._playbackRate = document.getElementById('playbackRate');
    this._skipPrevBtn = document.getElementById('skipPrev');
    this._skipNextBtn = document.getElementById('skipNext');
    this._skipVideo = document.getElementById('player');
    }

  _setEvents() {
    this._video.addEventListener('click', () => this.toggle());
    this._toggleBtn.addEventListener('click', () => this.toggle());
    this._video.addEventListener('timeupdate', () => this._handlerProgress());
    this._progressContainer.addEventListener('click', (e) => this._scrub(e));
    this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
    this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._volumeControl.addEventListener('input', (e) => this._video.volume = this._volumeControl.value, false);
    this._playbackRate.addEventListener('input', (e) => this._video.playbackRate = this._playbackRate.value, false);
    this._skipPrevBtn.addEventListener('click', () => this._video.currentTime += this._skipPrev);
    this._skipNextBtn.addEventListener('click', () => this._video.currentTime += this._skipNext);
    this._skipVideo.addEventListener('dblclick', (e) => {
      let clickRangeY = e.clientY >= this._skipVideo.offsetTop && e.clientY <= this._skipVideo.offsetHeight; 
      let leftX = e.clientX >= this._skipVideo.offsetLeft && e.clientX <= (this._skipVideo.offsetWidth / 2) + this._skipVideo.offsetLeft;
      //let rightX = e.clientX >= (this._skipVideo.offsetWidth / 2) + this._skipVideo.offsetLeft && e.clientX <= this._skipVideo.offsetLeft + this._skipVideo.offsetWidth;  ;
    if(clickRangeY === true && leftX === true){
      this._video.currentTime += this._skipPrev;
    } else  {
      this._video.currentTime += this._skipNext; };
    });
  }

  _addTemplate() {
    const template = this._createVideoTemplate();
    const container = document.querySelector(this._settings.videoPlayerContainer);
    container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
  }

  _createVideoTemplate() {
    return `
    <div class="player" id="player">
      <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
      <div class="player__controls">
        <div class="progress">
        <div class="progress__filled"></div>
        </div>
        <button class="player__button toggle" title="Toggle Play">►</button>
        <input type="range" name="volume" id="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
        <input type="range" name="playbackRate"  id="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
        <button data-skip="-1" id ='skipPrev' class="player__button">« 2s</button>
        <button data-skip="1" id ='skipNext' class="player__button">2s »</button>
      </div>
    </div>
    `;
  }

  static getDefaultSettings() {
      /**
       * Список настроек
       * - адрес видео
       * - тип плеера "basic", "pro"
       * - controls - true, false
       */
      return {
        videoUrl: '',
        videoPlayerContainer: '.myplayer',
        volume: 1
      }
  }
}

const myPlayer = new VideoPlayerBasic({
videoUrl: 'video/mov_bbb.mp4',
videoPlayerContainer: 'body',
skipNext: 2,
skipPrev: -2
});

myPlayer.init();