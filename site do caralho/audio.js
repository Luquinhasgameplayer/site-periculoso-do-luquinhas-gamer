// audio.js — versão mais resiliente
(function () {
  let currentAudio = null;
  let currentButton = null;

  function setupPlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn');

    if (!playButtons.length) {
      console.warn('audio.js: nenhum .play-btn encontrado no DOM.');
    }

    playButtons.forEach(button => {
      // evita duplicar handlers
      if (button._audioInit) return;
      button._audioInit = true;

      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const audioSrc = button.getAttribute('data-audio');

        if (!audioSrc) {
          console.error('audio.js: botão sem data-audio:', button);
          return;
        }

        // busca <audio> criado previamente com data-src
        let audio = document.querySelector(`audio[data-src="${audioSrc}"]`);

        if (!audio) {
          audio = document.createElement('audio');
          audio.setAttribute('data-src', audioSrc);
          audio.preload = 'metadata';
          audio.style.display = 'none';
          audio.src = audioSrc;
          document.body.appendChild(audio);

          // logs do carregamento
          audio.addEventListener('error', (err) => {
            console.error('audio.js: erro no elemento <audio> ao carregar src:', audioSrc, audio.error);
          });
          audio.addEventListener('canplay', () => {
            console.log('audio.js: canplay para', audioSrc);
          });
        }

        // pausa qualquer outro audio tocando
        if (currentAudio && currentAudio !== audio) {
          try { currentAudio.pause(); } catch (e) {}
          if (currentButton) currentButton.textContent = 'Reproduzir';
        }

        // play / pause com tratamento de promise
        if (audio.paused) {
          try {
            await audio.play();
            button.textContent = 'Pausar';
            currentAudio = audio;
            currentButton = button;
            console.log('audio.js: tocando ->', audioSrc);
          } catch (err) {
            console.error('audio.js: falha ao dar play em', audioSrc, err);
            alert('Erro ao tocar o áudio. Verifica o caminho do arquivo (ex: audio/thebox.mp3) e se está no servidor.');
          }
        } else {
          audio.pause();
          button.textContent = 'Reproduzir';
          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
          console.log('audio.js: pausado ->', audioSrc);
        }

        audio.onended = () => {
          if (button) button.textContent = 'Reproduzir';
          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
          console.log('audio.js: ended ->', audioSrc);
        };
      });
    });
  }

  // roda ao carregar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPlayButtons);
  } else {
    setupPlayButtons();
  }

  // se tu adicionar cards dinamicamente, chama setupPlayButtons() novamente
  window.initAudioButtons = setupPlayButtons;
})();
