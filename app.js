/* ===== Particle Background ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 270 : 200; // purple or blue
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

/* ===== Animated Counter ===== */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            if (isDecimal) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

heroObserver.observe(document.querySelector('.hero'));

/* ===== Chat Demo ===== */
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const executionLog = document.getElementById('executionLog');

let isProcessing = false;

const agentResponses = {
    'build a react dashboard with charts': [
        { type: 'log', badge: 'PLAN', badgeClass: 'badge-info', text: 'Breaking down request: React dashboard with charts' },
        { type: 'log', badge: 'TOOL', badgeClass: 'badge-info', text: 'Creating project structure with Next.js App Router' },
        { type: 'log', badge: 'CODE', badgeClass: 'badge-success', text: 'Writing DashboardLayout.tsx with sidebar navigation' },
        { type: 'log', badge: 'CODE', badgeClass: 'badge-success', text: 'Implementing Recharts bar chart component' },
        { type: 'log', badge: 'CODE', badgeClass: 'badge-success', text: 'Adding line chart with time-series data' },
        { type: 'log', badge: 'BUILD', badgeClass: 'badge-warn', text: 'Running npm install && npm run build' },
        { type: 'log', badge: 'DONE', badgeClass: 'badge-success', text: 'Build successful — 3 components, 2 chart types' },
        { type: 'message', text: 'Done! I\'ve built a React dashboard with:\n\n• Responsive layout with sidebar\n• Bar chart for revenue analytics\n• Line chart for traffic trends\n• Dark mode UI matching your brand\n\nAll components are in `/components/dashboard/`. Want me to add more charts or deploy it?' }
    ],
    'research the latest ai trends and summarize': [
        { type: 'log', badge: 'SEARCH', badgeClass: 'badge-info', text: 'Querying: "latest AI trends 2025"' },
        { type: 'log', badge: 'FETCH', badgeClass: 'badge-info', text: 'Retrieving 12 articles from tech sources' },
        { type: 'log', badge: 'READ', badgeClass: 'badge-success', text: 'Processing article: "AI Agents in Production"' },
        { type: 'log', badge: 'READ', badgeClass: 'badge-success', text: 'Processing article: "Multimodal LLMs Breakthrough"' },
        { type: 'log', badge: 'READ', badgeClass: 'badge-success', text: 'Processing article: "Edge AI Deployment Guide"' },
        { type: 'log', badge: 'ANALYZE', badgeClass: 'badge-warn', text: 'Extracting key themes and sentiment' },
        { type: 'log', badge: 'SUMMARIZE', badgeClass: 'badge-success', text: 'Generating structured report with citations' },
        { type: 'message', text: 'Here\'s your AI trends summary for 2025:\n\n🔥 **Top 3 Trends:**\n\n1. **Autonomous Agents** — Multi-step reasoning agents are moving from demo to production (OpenAI, Anthropic, Google all shipping)\n\n2. **Multimodal Everything** — Text + image + audio + video in single models. GPT-4o class models becoming standard\n\n3. **Edge Deployment** — Small models (1-3B params) running on-device with surprising quality. Privacy + latency win\n\n📈 **Sentiment:** 78% positive coverage, funding up 340% YoY\n\nWant me to dive deeper into any trend?' }
    ],
    'deploy a static site to vercel': [
        { type: 'log', badge: 'CHECK', badgeClass: 'badge-info', text: 'Verifying project structure and build output' },
        { type: 'log', badge: 'CONFIG', badgeClass: 'badge-info', text: 'Reading vercel.json for deployment settings' },
        { type: 'log', badge: 'BUILD', badgeClass: 'badge-warn', text: 'Optimizing images and minifying assets' },
        { type: 'log', badge: 'UPLOAD', badgeClass: 'badge-info', text: 'Uploading 47 files to Vercel Edge Network' },
        { type: 'log', badge: 'DEPLOY', badgeClass: 'badge-warn', text: 'Provisioning SSL certificate and DNS' },
        { type: 'log', badge: 'DONE', badgeClass: 'badge-success', text: 'Deployed to https://nexus-ai-demo.vercel.app' },
        { type: 'message', text: '🚀 **Deployed successfully!**\n\nYour site is live at:\n**https://nexus-ai-demo.vercel.app**\n\n• **Build time:** 4.2s\n• **Edge regions:** 18 global locations\n• **SSL:** Auto-provisioned\n• **Cache:** Optimized for static assets\n\nI\'ve also configured:\n• Custom domain redirect\n• Preview deployments for PRs\n• Analytics dashboard access\n\nWant me to set up a CI/CD pipeline next?' }
    ],
    'default': [
        { type: 'log', badge: 'THINK', badgeClass: 'badge-info', text: 'Analyzing user intent and context' },
        { type: 'log', badge: 'PLAN', badgeClass: 'badge-info', text: 'Formulating response strategy' },
        { type: 'message', text: 'I understand you want me to help with that. As an autonomous agent, I can:\n\n• Research and summarize information\n• Write and deploy code\n• Create visualizations and reports\n• Automate workflows across tools\n\nCould you provide a bit more detail so I can give you the most helpful response? For example, what format do you need the output in?' }
    ]
};

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLogEntry(badge, badgeClass, text) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">${getCurrentTime()}</span>
        <span class="log-badge ${badgeClass}">${badge}</span>
        <span class="log-text">${text}</span>
    `;
    executionLog.appendChild(entry);
    executionLog.scrollTop = executionLog.scrollHeight;
}

function addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
    message.innerHTML = `
        <div class="message-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${isUser 
                    ? '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'
                    : '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>'
                }
            </svg>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${isUser ? 'You' : 'Nexus'}</span>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findResponse(input) {
    const lower = input.toLowerCase().trim();
    for (const [key, value] of Object.entries(agentResponses)) {
        if (lower.includes(key) || key.includes(lower)) {
            return value;
        }
    }
    return agentResponses['default'];
}

async function processAgentResponse(input) {
    const responses = findResponse(input);
    
    for (const item of responses) {
        if (item.type === 'log') {
            addLogEntry(item.badge, item.badgeClass, item.text);
            await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
        } else if (item.type === 'message') {
            typingIndicator.classList.add('active');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
            typingIndicator.classList.remove('active');
            addMessage(item.text, false);
        }
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isProcessing) return;

    isProcessing = true;
    chatInput.value = '';
    sendBtn.disabled = true;

    addMessage(text, true);
    processAgentResponse(text).then(() => {
        isProcessing = false;
        sendBtn.disabled = false;
        chatInput.focus();
    });
}

function setInput(text) {
    chatInput.value = text;
    chatInput.focus();
}

function clearChat() {
    chatMessages.innerHTML = '';
    executionLog.innerHTML = `
        <div class="log-entry">
            <span class="log-time">${getCurrentTime()}</span>
            <span class="log-badge badge-info">INIT</span>
            <span class="log-text">Chat cleared — Agent reset</span>
        </div>
    `;
    
    // Re-add welcome message
    setTimeout(() => {
        addMessage("Hello! I'm Nexus, your autonomous AI agent. I can research, code, deploy, and automate workflows. What would you like me to build today?", false);
    }, 300);
}

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

/* ===== Toast Notifications ===== */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showDeployToast() {
    showToast('🚀 Deploying to Vercel... (demo mode)');
}

function showComingSoon() {
    showToast('📦 GitHub repo coming soon!');
}

/* ===== Scroll Reveal Animation ===== */
const revealElements = document.querySelectorAll('.feature-card, .tech-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${i * 0.1}s`;
    revealObserver.observe(el);
});

/* ===== Navbar Scroll Effect ===== */
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
    }
    
    lastScroll = currentScroll;
});

/* ===== Smooth scroll for nav links ===== */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
