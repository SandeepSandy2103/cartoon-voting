const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample images for fallback
const sampleImages = [
    "https://rukminim2.flixcart.com/image/850/1000/xif0q/action-figure/e/8/s/5-set-of-6-tom-and-jerry-action-figure-or-cake-topper-showpiece-original-imagg9ejgjcmgd9g.jpeg?q=90&crop=false",
    "https://image.api.playstation.com/vulcan/ap/rnd/202212/1616/ebKSYAneFeVLHD7SAWP1l5TE.png",
    "https://image.api.playstation.com/vulcan/img/rnd/202104/2308/e5A3zrfqnkwSN7BzIQZ73F8O.png",
];

// Sample data
let cartoons = [
    {
        id: 1,
        name: "Tom and Jerry",
        votes: 0,
        image_url: "https://rukminim2.flixcart.com/image/850/1000/xif0q/action-figure/e/8/s/5-set-of-6-tom-and-jerry-action-figure-or-cake-topper-showpiece-original-imagg9ejgjcmgd9g.jpeg?q=90&crop=false"
    },
    {
        id: 2,
        name: "Mickey Mouse",
        votes: 0,
        image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202212/1616/ebKSYAneFeVLHD7SAWP1l5TE.png"
    },
    {
        id: 3,
        name: "Donald Duck",
        votes: 0,
        image_url: "https://image.api.playstation.com/vulcan/img/rnd/202104/2308/e5A3zrfqnkwSN7BzIQZ73F8O.png"
    }
];

// Get all cartoons
app.get('/cartoons', (req, res) => {
    // Add sample images if 'image_url' is missing
    const cartoonsWithImages = cartoons.map((cartoon, index) => ({
        ...cartoon,
        image_url: cartoon.image_url || sampleImages[index % sampleImages.length]
    }));
    res.json(cartoonsWithImages);
});

// Vote for a cartoon
app.post('/vote', (req, res) => {
    const { id } = req.body;
    const cartoon = cartoons.find(c => c.id === id);
    
    if (cartoon) {
        cartoon.votes++;
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Cartoon not found' });
    }
});

// Get voting results
app.get('/results', (req, res) => {
    const totalVotes = cartoons.reduce((sum, cartoon) => sum + cartoon.votes, 0);
    
    const results = cartoons.map(cartoon => ({
        id: cartoon.id,
        name: cartoon.name,
        percentage: totalVotes > 0 ? ((cartoon.votes / totalVotes) * 100).toFixed(1) : 0
    }));
    
    res.json(results);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 