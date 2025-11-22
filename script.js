// Sparkle cursor trail
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.92) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = ['🦎', '🌿', '🪴', '🌱'][Math.floor(Math.random() * 4)];
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
});

// Visitor counter animation
let count = 42069;
setInterval(() => {
    count += Math.floor(Math.random() * 3);
    document.getElementById('counter').textContent = count.toString().padStart(9, '0');
}, 3000);

// Quote carousel
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote');

function showQuote(index) {
    quotes.forEach(q => q.classList.remove('active'));
    quotes[index].classList.add('active');
}

function nextQuote() {
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
}

function prevQuote() {
    currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
    showQuote(currentQuote);
}

// Auto-advance quotes
setInterval(nextQuote, 5000);

// Confetti explosion
function explodeConfetti() {
    const celebration = document.getElementById('celebration');
    const colors = ['#50C878', '#98FB98', '#ADFF2F', '#00FF00', '#228B22', '#006400'];
    const shapes = ['🦎', '🌿', '🪴', '🌱', '🍀', '💚'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        celebration.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        alert('🦎 SECRET UNLOCKED: YOU ARE NOW LEGALLY REQUIRED TO GIVE MATILDULUS ZAMBIASULUS A HUG 🦎');
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Console message
console.log('%c🦎 CONGRATS MATILDULUS ZAMBIASULUS! 🦎', 'font-size: 30px; color: #228B22; text-shadow: 2px 2px 0 #ADFF2F;');
console.log('%cIf you found this, you are a nerd (affectionate)', 'font-size: 14px; color: #50C878;');

// Matilde Facts Reveal Section
// Add your facts here in this format:
// Use 'revealValue' for both numbers and text
const matildeFacts = [
    {
        id: 1,
        text: "An adult Matilde could eat up to",
        revealValue: 100,
        unit: "pieces of red meat in a hotpot"
    },
    {
        id: 2,
        text: "Matilde has very questionable taste like",
        revealValue: "ale pagan",
        unit: ""
    },
    {
        id: 3,
        text: "Matilde really likes telling the story of",
        revealValue: "the exploding pope",
        unit: ""
    },
    {
        id: 4,
        text: "If you are not careful Matilde could",
        revealValue: "chew your arm",
        unit: ""
    },
    {
        id: 5,
        text: "Matilde has no mercy if you are",
        revealValue: "walking slow",
        unit: ""
    },
    {
        id: 6,
        text: "Matilde often curses",
        revealValue: "tram 9",
        unit: "creating chaos in milan"
    }
];

// Carousel state
let currentFactIndex = 0;

// Initialize facts reveal section as carousel
function initFactsReveal() {
    const container = document.getElementById('facts-container');
    if (!container) {
        return;
    }

    // Clear container first
    container.innerHTML = '';

    // Check if we have any facts
    if (!matildeFacts || matildeFacts.length === 0) {
        container.innerHTML = '<p style="text-align: center; font-family: \'Comic Neue\', cursive; color: var(--grape-soda); font-size: 1.2rem; padding: 40px;">Add facts to the matildeFacts array in script.js! 🦎</p>';
        return;
    }

    // Create carousel structure
    container.innerHTML = `
        <div class="facts-carousel-wrapper">
            <button class="carousel-nav-btn carousel-prev" id="carousel-prev">←</button>
            <div class="facts-carousel-track" id="facts-carousel-track">
                <!-- Facts will be added here -->
            </div>
            <button class="carousel-nav-btn carousel-next" id="carousel-next">→</button>
        </div>
        <div class="carousel-indicators" id="carousel-indicators">
            <!-- Indicators will be added here -->
        </div>
    `;

    const track = document.getElementById('facts-carousel-track');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    // Load revealed facts from localStorage
    const revealedFacts = JSON.parse(localStorage.getItem('revealedFacts') || '[]');

    // Create all fact cards (hidden except current)
    matildeFacts.forEach((fact, index) => {
        const isRevealed = revealedFacts.includes(fact.id);
        const revealValue = fact.revealValue;
        
        const factCard = document.createElement('div');
        factCard.className = `fact-card carousel-slide ${index === 0 ? 'active' : ''}`;
        factCard.dataset.factId = fact.id;
        factCard.dataset.index = index;
        
        factCard.innerHTML = `
            <p class="fact-text">
                ${fact.text} 
                <span class="number-placeholder ${isRevealed ? 'revealed' : ''}" data-reveal="${revealValue}">
                    ${isRevealed ? revealValue : ''}
                </span> 
                ${fact.unit ? fact.unit : ''}
            </p>
            <button class="reveal-btn ${isRevealed ? 'revealed' : ''}" data-fact-id="${fact.id}">
                ${isRevealed ? '✓ Revealed' : '🔍 Reveal'}
            </button>
        `;
        
        track.appendChild(factCard);
        
        // Add click handler for reveal button
        const revealBtn = factCard.querySelector('.reveal-btn');
        const numberPlaceholder = factCard.querySelector('.number-placeholder');
        
        if (!isRevealed) {
            revealBtn.addEventListener('click', () => {
                revealFact(fact.id, numberPlaceholder, revealBtn, factCard);
            });
        }

        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.dataset.index = index;
        indicator.setAttribute('aria-label', `Go to fact ${index + 1}`);
        indicator.addEventListener('click', () => goToFact(index));
        indicatorsContainer.appendChild(indicator);
    });

    // Navigation buttons
    document.getElementById('carousel-prev').addEventListener('click', () => {
        goToFact((currentFactIndex - 1 + matildeFacts.length) % matildeFacts.length);
    });

    document.getElementById('carousel-next').addEventListener('click', () => {
        goToFact((currentFactIndex + 1) % matildeFacts.length);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.querySelector('.facts-reveal-section');
        if (!carouselSection) return;
        
        const rect = carouselSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToFact((currentFactIndex - 1 + matildeFacts.length) % matildeFacts.length);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToFact((currentFactIndex + 1) % matildeFacts.length);
            }
        }
    });
}

function goToFact(index) {
    if (index < 0 || index >= matildeFacts.length) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Update current index
    currentFactIndex = index;
    
    // Update slides
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function revealFact(factId, numberElement, button, card) {
    // Check if already revealed
    if (numberElement.classList.contains('revealed')) return;
    
    const revealValue = numberElement.dataset.reveal;
    
    // Add revealed class
    numberElement.classList.add('revealed');
    numberElement.textContent = revealValue;
    
    // Update button
    button.classList.add('revealed');
    button.textContent = '✓ Revealed';
    button.disabled = true;
    
    // Save to localStorage
    const revealedFacts = JSON.parse(localStorage.getItem('revealedFacts') || '[]');
    if (!revealedFacts.includes(factId)) {
        revealedFacts.push(factId);
        localStorage.setItem('revealedFacts', JSON.stringify(revealedFacts));
    }
    
    // Add sparkle effect
    createSparkleEffect(card);
}

function createSparkleEffect(card) {
    const sparkles = ['🦎', '🌿', '🪴', '🌱', '✨', '💚'];
    const numberElement = card.querySelector('.number-placeholder');
    const rect = numberElement.getBoundingClientRect();
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-emoji';
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 100) + 'px';
            sparkle.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 100) + 'px';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 50);
    }
}

// Initialize when DOM is ready
(function() {
    function tryInit() {
        const container = document.getElementById('facts-container');
        if (container) {
            initFactsReveal();
        } else {
            // Retry if container not found yet
            setTimeout(tryInit, 50);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        // DOM already loaded
        tryInit();
    }

    // Backup: also try on window load
    window.addEventListener('load', () => {
        const container = document.getElementById('facts-container');
        if (container && container.children.length === 0) {
            initFactsReveal();
        }
    });
})();

