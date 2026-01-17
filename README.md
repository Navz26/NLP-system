Twitter Sentiment Analysis for Stock Market Insights

1) Project Overview
This project analyzes stock market sentiment using Twitter data to help understand public opinion around major stock tickers. It applies Natural Language Processing (NLP) techniques, including a local BERT-based sentiment classifier and lightweight topic modeling, to classify tweets and uncover key discussion themes.
The processed results are exported to Excel files and can be further stored in a data warehouse for analytical and predictive use cases, such as algorithmic trading and market trend analysis.

2) Objectives
Analyze Twitter data related to stock market discussions
Classify tweets into positive, neutral, or negative sentiment
Identify key topics discussed within tweets
Generate structured datasets for downstream analytics and visualization
Support traders and analysts in refining trading strategies

3) Technologies Used
Node.js
BERT (Xenova Transformers – Local Inference)
Natural Language Processing (NLP)
JavaScript
Excel (XLSX processing)
Compromise NLP library
Custom K-Means clustering
TensorFlow.js


4)  Project Structure
.
├── analyze.js                    # BERT-based sentiment analysis
├── light_topic_modeling.js       # Lightweight topic modeling & clustering
├── Twitter_Sentiment_Dataset.xlsx
├── sentiment_results.xlsx        # Output: sentiment classification
├── tweets_with_light_topics.xlsx # Output: topic modeling results
├── package.json
├── package-lock.json


5) How It Works
   
   a) Sentiment Analysis (BERT)
Loads tweets from an Excel dataset
Uses a multilingual BERT sentiment model
Classifies each tweet as:
Positive
Neutral
Negative
Outputs sentiment label and confidence score
Saves results to sentiment_results.xlsx

   b) Light Topic Modeling
Cleans and preprocesses tweet text
Removes stopwords and generates unigrams & bigrams
Builds term vectors
Applies custom K-Means clustering
Assigns topic labels to tweets
Saves results to tweets_with_light_topics.xlsx

6) How to Run the Project
Prerequisites
Node.js (v18+ recommended)
npm
Install Dependencies
npm install
Run Sentiment Analysis
node analyze.js
Run Topic Modeling
node light_topic_modeling.js

7)  Output Files
sentiment_results.xlsx
→ Tweet-level sentiment classification with confidence scores
tweets_with_light_topics.xlsx
→ Topic assignments for each tweet

8) Use Cases
Algorithmic trading sentiment signals
Market trend analysis
Financial NLP research
Data warehousing and BI dashboards
Investor decision support systems

9) Future Enhancements
Real-time Twitter API integration
Cloud deployment (AWS/GCP)
Dashboard visualization (Power BI / Tableau)
Advanced topic modeling (LDA / BERTopic)
Integration with automated trading systems

10) Author
Navpreet Kaur
Bachelor’s in Computer Information Systems (CIS)
GitHub: https://github.com/Navz26
