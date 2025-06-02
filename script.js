/*   
  JavaScript clone Netflix
  ==============================
  1) Botão de som para ligar/desligar o áudio do vídeo de capa
  2) Tocar áudio “TUDUM” ao carregar a página
  3) Mostrar e esconder o modal de “Mais Informações”
  4) Carrossel infinito com autoplay, botões de navegação e swipe no mobile
*/

// Seleções iniciais
const btnSom     = document.querySelector(".btn-som");
const videoBg    = document.querySelector(".video-bg");
const btnInfo    = document.querySelector(".btn-info");
const modal      = document.getElementById("modal-info");
const modalClose = document.querySelector(".modal-close");
const audio      = document.querySelector(".audio");

// 1) Botão de som: liga/desliga áudio do vídeo
btnSom.addEventListener("click", () => {
  videoBg.muted = !videoBg.muted;
  btnSom.textContent = videoBg.muted ? "🔇" : "🔈";
});

// 2) Tocar áudio “TUDUM” ao carregar a página
window.addEventListener("load", () => {
  audio.play();
});

// 3) Mostrar e esconder Modal de informações
btnInfo.addEventListener("click", () => {
  modal.style.display = "flex";
});
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// 4) Carrossel infinito com autoplay, botões e swipe
// -------------------------------------------------

// Seleciona elementos do carrossel
const track   = document.querySelector(".carousel-track");
const images  = Array.from(document.querySelectorAll(".carousel-img"));
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");

// Índice atual e controle de drag para swipe
let index      = 0;
let isDragging = false;
let startX     = 0;

// 4.1) Duplicar cada imagem para criar o “loop infinito”
images.forEach(img => {
  const clone = img.cloneNode(true);
  track.appendChild(clone);
});

// Agora temos todas as imagens originais + clones ao final:
// Criamos um array de todas as imagens (“slides”) dentro do track
const allImages = Array.from(track.querySelectorAll(".carousel-img"));
const total     = allImages.length;       // total de slides (orig + clones)

// 4.2) Retorna quantas imagens aparecem simultaneamente, de acordo com a largura da tela
function getVisibleItems() {
  const width = window.innerWidth;
  if (width < 480) return 1;
  if (width < 780) return 2;
  if (width < 1024) return 3;
  return 4;
}

// 4.3) Atualiza a posição do track usando transform: translateX(...)
function updateCarousel() {
  const visibleItems = getVisibleItems();
  // largura de um slide = largura + margem horizontal (20px = 10px cada lado)
  const singleWidth   = allImages[0].offsetWidth + 20;
  // deslocamento: index * largura de um slide
  const offset        = index * singleWidth;
  track.style.transform = `translateX(-${offset}px)`;
}

// 4.4) Avançar um slide (loop infinito)
function nextSlide() {
  const visibleItems = getVisibleItems();
  // se índice chegar no fim do “primeiro conjunto”:
  if (index >= Math.floor((total / 2) - visibleItems)) {
    // volta para o índice 0 (início do primeiro conjunto)
    index = 0;
  } else {
    index++;
  }
  updateCarousel();
}

// 4.5) Voltar um slide (loop infinito)
function prevSlide() {
  const visibleItems = getVisibleItems();
  // se índice estiver em 0 (início do primeiro conjunto):
  if (index <= 0) {
    // posiciona no fim do “primeiro conjunto”
    index = Math.floor((total / 2) - visibleItems);
  } else {
    index--;
  }
  updateCarousel();
}

// 4.6) Botões de navegação
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// 4.7) Autoplay: avança a cada 3 segundos
setInterval(nextSlide, 3000);

// 4.8) Swipe (toque) no mobile/tablet
track.addEventListener("touchstart", e => {
  startX     = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener("touchmove", e => {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const diff     = startX - currentX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    isDragging = false;
  }
});

track.addEventListener("touchend", () => {
  isDragging = false;
});

// 4.9) Ao redimensionar a janela, reposiciona o carrossel
window.addEventListener("resize", updateCarousel);

// 4.10) Inicializa a posição do carrossel (chama uma vez)
updateCarousel();