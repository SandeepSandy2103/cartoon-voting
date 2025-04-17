const BACKEND_URL = 'http://localhost:8081';

async function loadCartoons() {
    try {
        const res = await fetch(`${BACKEND_URL}/cartoons`);
        const cartoons = await res.json();
        const gallery = document.getElementById('cartoon-gallery');
        gallery.innerHTML = '';
        
        cartoons.forEach((cartoon) => {
            const img = document.createElement('img');
            img.src = cartoon.image_url;
            img.alt = cartoon.name;
            img.className = 'cartoon-img';
            img.onclick = () => vote(cartoon.id);
            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Failed to load cartoons:', error);
    }
}

async function vote(id) {
    try {
        await fetch(`${BACKEND_URL}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        updateResults();
    } catch (error) {
        console.error('Failed to vote:', error);
    }
}

async function updateResults() {
    try {
        const res = await fetch(`${BACKEND_URL}/results`);
        const data = await res.json();
        const results = document.getElementById('results');
        results.innerHTML = '';
        
        data.forEach((entry) => {
            const div = document.createElement('div');
            div.className = 'result-bar';
            div.innerHTML = `
                <span>${entry.name}: ${entry.percentage}%</span>
                <div class="bar" style="width: ${entry.percentage}%;"></div>
            `;
            results.appendChild(div);
        });
    } catch (error) {
        console.error('Failed to update results:', error);
    }
}

// Initialize the app
window.onload = () => {
    loadCartoons();
    updateResults();
    setInterval(updateResults, 5000); // Update every 5s
}; 