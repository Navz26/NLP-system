// analyze.js - Local BERT Sentiment Analysis
const { pipeline } = require('@xenova/transformers');
const XLSX = require('xlsx');
const fs = require('fs');

(async () => {
  try {
    // 1. Load Excel file
    const workbook = XLSX.readFile('Twitter_Sentiment_Dataset.xlsx');
    const sheetName = workbook.SheetNames[0];
    const tweets = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 2. Load BERT model (will auto-download first time)
    console.log('Loading BERT model... (this may take a few minutes first time)');
    const classifier = await pipeline('text-classification', 
      'Xenova/bert-base-multilingual-uncased-sentiment');

    // 3. Process tweets
    const results = [];
    for (const [index, tweet] of tweets.entries()) {
      const analysis = await classifier(tweet.Tweet);
      results.push({
        ...tweet,
        Predicted_Sentiment: analysis[0].label,
        Confidence_Score: Math.round(analysis[0].score * 100) + '%'
      });
      console.log(`Processed ${index + 1}/${tweets.length}: ${tweet.Tweet.substring(0, 30)}...`);
    }

    // 4. Save results
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, 
      XLSX.utils.json_to_sheet(results), 
      'Sentiment Results');
    XLSX.writeFile(newWorkbook, 'sentiment_results.xlsx');
    
    console.log('\n✅ Analysis complete! Results saved to sentiment_results.xlsx');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();