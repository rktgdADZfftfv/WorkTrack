const thumbnailInput = document.getElementById('thumbnailInput');
const previewImage = document.getElementById('previewImage');
const topicInput = document.getElementById('topicInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const aiScore = document.getElementById('aiScore');
const aiFeedbackText = document.getElementById('aiFeedbackText');

let base64Image = "";

// 1. Show Image Preview when uploaded
thumbnailInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';

            // Extract base64 data for the backend
            base64Image = e.target.result.split(',')[1];
        }
        reader.readAsDataURL(file);
    }
});

// 2. Send Data to Vercel Backend when button is clicked
analyzeBtn.addEventListener('click', async function () {
    const topic = topicInput.value;

    if (!base64Image || !topic) {
        alert("Please upload a thumbnail and enter a video topic!");
        return;
    }

    // Show loading state
    analyzeBtn.innerText = "Analyzing... ⏳";
    analyzeBtn.disabled = true;
    resultSection.classList.remove('hidden');
    aiScore.innerHTML = "";
    aiFeedbackText.innerText = "Our AI is analyzing your thumbnail and topic...";

    try {
        // We will create this /api/analyze route in the next step!
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image, topic: topic })
        });

        const data = await response.json();

        if (response.ok) {
            // Display the AI result
            aiScore.innerHTML = `<strong>Rating:</strong> ${data.score}/10 ⭐`;
            aiFeedbackText.innerText = data.feedback;
        } else {
            aiFeedbackText.innerText = "Error: " + data.error;
        }
    } catch (error) {
        aiFeedbackText.innerText = "Failed to connect to the server.";
    }

    // Reset button
    analyzeBtn.innerText = "Analyze with AI ✨";
    analyzeBtn.disabled = false;
});