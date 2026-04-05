// --- DARK MODE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check karein agar user ne pehle se Dark Mode set kiya tha
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerText = '☀️';
}

// Button click par theme change karein
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark'); // Save choice
        themeToggle.innerText = '☀️';        // Icon change to Sun
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';        // Icon change to Moon
    }
});