console.log('Script carregado!');

const showCardsBtn = document.getElementById('show-cards-btn');
const container = document.getElementById('carousel-container');
const carousel = document.querySelector('.container');

console.log('Botão encontrado?', showCardsBtn);
console.log('Container encontrado?', container);

// Variáveis para controle do carousel
let cardWidth = 0;
let totalCards = 0;
let currentIndex = 0;
let isAutoScrolling = true;
let autoScrollInterval;

// Inicializar o carousel
function initCarousel() {
  // Inicializar variáveis
  totalCards = document.querySelectorAll('.card-idler').length;
  cardWidth = document.querySelector('.card-idler').offsetWidth + 70; // width + gap
  
  // Iniciar auto-scroll
  startAutoScroll();
  
  // Adicionar event listeners
  addEventListeners();
}

// Ir para card específico
function goToCard(index) {
  if (index < 0) index = 0;
  if (index >= totalCards) index = totalCards - 1;
  
  currentIndex = index;
  carousel.scrollTo({
    left: index * cardWidth,
    behavior: 'smooth'
  });
}

// Iniciar auto-scroll
function startAutoScroll() {
  // Limpar intervalo existente, se houver
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
  
  autoScrollInterval = setInterval(() => {
    if (isAutoScrolling) {
      currentIndex = (currentIndex + 1) % totalCards;
      goToCard(currentIndex);
    }
  }, 5000); // Muda a cada 3 segundos
}

// Parar auto-scroll temporariamente
function pauseAutoScroll() {
  isAutoScrolling = false;
  setTimeout(() => {
    isAutoScrolling = true;
  }, 5000); // Retoma após 5 segundos
}

// Adicionar event listeners
function addEventListeners() {
  // Navegação por swipe (para dispositivos móveis)
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    pauseAutoScroll();
  }, false);
  
  // Pausar auto-scroll quando o usuário interagir com o mouse
  carousel.addEventListener('mousedown', () => {
    pauseAutoScroll();
  });
  
  // Atualizar índice baseado na rolagem
  carousel.addEventListener('scroll', () => {
    const scrollPos = carousel.scrollLeft;
    const newIndex = Math.round(scrollPos / cardWidth);
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
    }
  });
}

// Manipular gestos de swipe
function handleSwipe() {
  const minSwipeDistance = 50; // Distância mínima para considerar um swipe
  
  if (touchStartX - touchEndX > minSwipeDistance) {
    // Swipe para a esquerda - próximo card
    goToCard(currentIndex + 1);
  } 
  
  if (touchEndX - touchStartX > minSwipeDistance) {
    // Swipe para a direita - card anterior
    goToCard(currentIndex - 1);
  }
}

if (showCardsBtn) {
  showCardsBtn.addEventListener('click', function() {
    console.log('Botão clicado!');
    container.style.display = 'flex';
    this.style.display = 'none';
    
    // Inicializar carousel após os elementos estarem visíveis
    setTimeout(() => {
      initCarousel();
    }, 100);
  });
} else {
  console.error("❌ Botão não encontrado no DOM");
}