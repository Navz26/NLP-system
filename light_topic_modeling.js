const compromise = require('compromise');
const XLSX = require('xlsx');
const fs = require('fs');

// Configuration
const CONFIG = {
  numTopics: 3,
  inputFile: 'Twitter_Sentiment_Dataset.xlsx',
  outputFile: 'tweets_with_light_topics.xlsx',
  minTweetLength: 10,
  stopwords: ['stock', 'today', 'price', 'market', 'share']
};

function processText(text) {
    const clean = (text || '').toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  
    // Tokenize using compromise
    const doc = compromise(clean);
    const terms = doc.terms().out('array')
      .filter(token => !CONFIG.stopwords.includes(token));
  
    // Extract bigrams manually
    const bigrams = [];
    for (let i = 0; i < terms.length - 1; i++) {
      bigrams.push(`${terms[i]} ${terms[i + 1]}`);
    }
  
    return [...new Set([...terms, ...bigrams])];
  }
  

function buildVectors(docs) {
  const vocab = [...new Set(docs.flat())];
  return docs.map(doc => vocab.map(word => doc.includes(word) ? 1 : 0));
}

function cosineSim(vecA, vecB) {
  const dot = vecA.reduce((sum, v, i) => sum + v * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((sum, v) => sum + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// Basic K-Means (manual implementation, fewer iterations)
function kmeans(vectors, k, maxIterations = 20) {
  const centroids = vectors.slice(0, k);
  let assignments = Array(vectors.length).fill(-1);

  for (let iter = 0; iter < maxIterations; iter++) {
    assignments = vectors.map(v =>
      centroids.map(c => cosineSim(v, c)).reduce((bestIdx, sim, i, sims) =>
        sims[i] > sims[bestIdx] ? i : bestIdx, 0)
    );

    centroids.forEach((_, ci) => {
      const cluster = vectors.filter((_, i) => assignments[i] === ci);
      if (cluster.length > 0) {
        centroids[ci] = cluster[0].map((_, i) =>
          cluster.reduce((sum, v) => sum + v[i], 0) / cluster.length);
      }
    });
  }

  return assignments;
}

function analyze() {
  try {
    console.log('📥 Loading Excel file...');
    const workbook = XLSX.readFile(CONFIG.inputFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const tweets = XLSX.utils.sheet_to_json(sheet)
      .filter(t => t.Tweet && t.Tweet.length >= CONFIG.minTweetLength);

    console.log('🔍 Processing tweets...');
    const processedDocs = tweets.map(t => processText(t.Tweet));

    console.log('🧮 Building term vectors...');
    const vectors = buildVectors(processedDocs);

    console.log('📊 Clustering into topics...');
    const topics = kmeans(vectors, CONFIG.numTopics);

    const results = tweets.map((t, i) => ({
      ...t,
      Topic: topics[i] + 1
    }));

    const outWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(outWorkbook, XLSX.utils.json_to_sheet(results), 'Results');
    XLSX.writeFile(outWorkbook, CONFIG.outputFile);

    console.log(`✅ Done! Output saved to ${CONFIG.outputFile}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

analyze();
