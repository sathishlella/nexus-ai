// Particle Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Chat System
class ChatSystem {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.suggestions = document.querySelectorAll('.suggestion-chip');
        
        this.responses = {
            'research': "I've analyzed the latest AI trends for 2025. Key findings: multimodal models are dominating, agentic AI is becoming mainstream, and edge deployment is growing 300% YoY. Would you like a detailed report?",
            'python': "Here's a Python script for data analysis:\n\n```python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load and analyze data\ndf = pd.read_csv('data.csv')\nsummary = df.describe()\nprint(summary)\n```\n\nThis handles loading, statistical summary, and is ready for visualization extension.",
            'strategy': "After analyzing your business strategy, I recommend:\n\n1. **Double down on AI integration** - 73% of competitors are already adopting\n2. **Expand to APAC markets** - 45% growth potential\n3. **Build a developer community** - Network effects are key in this space",
            'default': "That's an interesting request! I can help with that. Let me analyze the requirements and get back to you with a comprehensive solution. Is there anything specific you'd like me to focus on?"
        };

        this.bindEvents();
    }

    bindEvents() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                this.input.value = chip.dataset.msg;
                this.sendMessage();
            });
        });
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTyping();

        // Generate response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(text);
            this.addMessage(response, 'ai');
        }, 1500 + Math.random() * 1000);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        
        const avatar = type === 'ai' 
            ? '<div class="message-avatar"><span>N</span></div>'
            : '<div class="message-avatar" style="background: var(--bg-secondary); border: 1px solid var(--border-glass);"><span>U</span></div>';

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${this.escapeHtml(text)}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-ai typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><span>N</span></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    generateResponse(text) {
        const lower = text.toLowerCase();
        if (lower.includes('research') || lower.includes('trend')) return this.responses.research;
        if (lower.includes('python') || lower.includes('code') || lower.includes('script')) return this.responses.python;
        if (lower.includes('strategy') || lower.includes('business') || lower.includes('analyze')) return this.responses.strategy;
        return this.responses.default;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => this.observer.observe(counter));
    }

    animate(counter) {
        const target = parseFloat(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            
            counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = isDecimal ? target.toFixed(1) : target;
            }
        };

        requestAnimationFrame(update);
    }
}

// Scroll Reveal
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.feature-card, .section-header, .terminal-window, .cta-content');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// Smooth scroll for nav links
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// Navbar scroll effect
class NavbarEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) new ParticleSystem(canvas);
    
    new ChatSystem();
    new CounterAnimation();
    new ScrollReveal();
    new SmoothScroll();
    new NavbarEffect();
});
