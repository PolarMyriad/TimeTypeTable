let sentimentModel = null;

// model
async function loadSentimentModel() {
    try {
        const response = await fetch("./sentiment_model.json");

        if (!response.ok) {
            throw new Error("Could not load sentiment_model.json");
        }

        sentimentModel = await response.json();

        console.log("Sentiment model loaded");
        return true;

    } catch (error) {
        console.error("Model loading error:", error);
        return false;
    }
}

// tf-idf vector
function convertToTfidf(text) {
    const vocabulary = sentimentModel.vocabulary;
    const idf = sentimentModel.idf;

    const tokens = text.toLowerCase().match(/\b\w\w+\b/g) || [];
    const counts = {};

    tokens.forEach(token => {
        if (vocabulary[token] !== undefined) {
            counts[token] = (counts[token] || 0) + 1;
        }
    });

    const vector = new Array(idf.length).fill(0);

    for (const token in counts) {
        const index = vocabulary[token];
        vector[index] = counts[token] * idf[index];
    }

    // L2 normalisation
    const magnitude = Math.sqrt(
        vector.reduce((sum, value) => sum + value * value, 0)
    );

    if (magnitude > 0) {
        for (let i = 0; i < vector.length; i++) {
            vector[i] /= magnitude;
        }
    }

    return vector;
}

function predictSentiment(text) {
    if (!sentimentModel) {
        throw new Error("sentiment model has not loaded yet");
    }

    if (!text || !text.trim()) {
        throw new Error("please enter mood first");
    }

    const vector = convertToTfidf(text);

    const { classes, coefficients, intercepts } = sentimentModel;

    const scores = coefficients.map((weights, classIndex) => {
        let score = intercepts[classIndex];

        for (let i = 0; i < vector.length; i++) {
            score += weights[i] * vector[i];
        }

        return score;
    });

    const maxScore = Math.max(...scores);

    const exponentials = scores.map(
        score => Math.exp(score - maxScore)
    );

    const total = exponentials.reduce(
        (sum, value) => sum + value, 0
    );

    const probabilities = exponentials.map(
        value => value / total
    );

    const bestIndex = probabilities.indexOf(
        Math.max(...probabilities)
    );

    return {
        mood: classes[bestIndex],
        confidence: probabilities[bestIndex]
    };
}
