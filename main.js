// Función para manejar el modo de contacto con efectos de sonido
function setupContactModal() {
    const modal = document.getElementById("contactModal");
    const btn = document.getElementById("info-icon");
    const span = document.getElementsByClassName("close")[0];
    const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3');
    const closeSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3');

    // Mostrar modal al hacer clic en el ícono de información
    btn.addEventListener("click", function(e) {
        e.preventDefault();
        clickSound.play();
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "15px"; // Compensar la barra de desplazamiento
    });

    // Cerrar modal al hacer clic en la X
    span.addEventListener("click", function() {
        closeSound.play();
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "0";
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeSound.play();
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        }
    });

    // Manejar el envío del formulario con animación
    const contactForm = document.getElementById("contactForm");
    const submitSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        submitSound.play();
        
        // Mostrar animación de envío
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simular envío (en producción usar fetch)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
            setTimeout(() => {
                modal.style.display = "none";
                contactForm.reset();
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = "0";
                submitBtn.innerHTML = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }, 1000);
        }, 1500);
    });
}

// Función para animación de cambio de colores estilo luces de club
function setupColorAnimation() {
    const root = document.documentElement;
    let hue = 300; // Comenzar con tonos morados

    function updateColors() {
        hue = (hue + 0.5) % 360;
        root.style.setProperty('--primary-color', `hsl(${hue}, 70%, 50%)`);
        root.style.setProperty('--secondary-color', `hsl(${(hue + 30) % 360}, 70%, 40%)`);
        root.style.setProperty('--accent-color', `hsl(${(hue + 60) % 360}, 80%, 70%)`);
        requestAnimationFrame(updateColors);
    }

    // Iniciar la animación de colores
    updateColors();
}

// Función para animar las tarjetas al aparecer con efecto de beat
function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.section-card');
    const beatSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    let soundPlayed = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
                
                // Efecto de beat en la primera tarjeta visible
                if (!soundPlayed && entry.isIntersecting) {
                    soundPlayed = true;
                    beatSound.currentTime = 0;
                    beatSound.play();
                    entry.target.style.transform = "translateY(0) scale(1.05)";
                    setTimeout(() => {
                        entry.target.style.transform = "translateY(0) scale(1)";
                    }, 300);
                }
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px) scale(0.95)";
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(card);
    });
}

// Función para el visualizador de audio interactivo
function setupAudioVisualizer() {
    const bars = document.querySelectorAll('.bar');
    const beatInterval = 500; // ms
    let lastBeat = 0;

    function animateBars(timestamp) {
        if (timestamp - lastBeat > beatInterval) {
            lastBeat = timestamp;
            bars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 80) + 10;
                bar.style.height = `${randomHeight}px`;
                
                // Cambiar color aleatoriamente
                const randomHue = Math.floor(Math.random() * 60) + 270; // Tonos morados/rosas
                bar.style.background = `linear-gradient(to top, hsl(${randomHue}, 80%, 60%), var(--secondary-color)`;
            });
        }
        requestAnimationFrame(animateBars);
    }

    // Iniciar animación
    requestAnimationFrame(animateBars);

    // Interacción con el mouse
    const visualizer = document.querySelector('.visualizer');
    if (visualizer) {
        visualizer.addEventListener('mousemove', (e) => {
            const rect = visualizer.getBoundingClientRect();
            const xPos = e.clientX - rect.left;
            const width = rect.width;
            const beatIntensity = 1 - (xPos / width);
            
            bars.forEach((bar, index) => {
                const delay = index * 0.1;
                setTimeout(() => {
                    const newHeight = Math.floor(beatIntensity * 80) + 10;
                    bar.style.height = `${newHeight}px`;
                }, delay * 1000);
            });
        });
    }
}

// Función para el desplazamiento suave con efecto de sonido
function setupSmoothScrolling() {
    const scrollSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                scrollSound.currentTime = 0;
                scrollSound.play();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Función principal que se ejecuta cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", function() {
    setupContactModal();
    setupColorAnimation();
    animateCardsOnScroll();
    setupAudioVisualizer();
    setupSmoothScrolling();

    // Efecto hover mejorado para las tarjetas con sonido
    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-hover-click-notification-358.mp3');
    const cards = document.querySelectorAll('.section-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            hoverSound.currentTime = 0;
            hoverSound.play();
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
    });

    // Efecto de parpadeo aleatorio para simular luces de club
    setInterval(() => {
        const randomElement = document.querySelectorAll('h1, h2, h3, .btn, .social-icon')[Math.floor(Math.random() * 10)];
        if (randomElement) {
            randomElement.style.textShadow = `0 0 10px hsl(${Math.random() * 360}, 100%, 50%)`;
            setTimeout(() => {
                randomElement.style.textShadow = '';
            }, 200);
        }
    }, 300);
});