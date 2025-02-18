import React, { useState } from "react";

function Search() {
  const [searchHistory, setSearchHistory] = useState([]); // Array to store search history
  const [query, setQuery] = useState(""); // Current search input
  const [recommendations, setRecommendations] = useState([]); // Last five searches for recommendations
  const [dashboard, setDashboard] = useState(""); // Only the currently searched topic
  const [newsArticles, setNewsArticles] = useState([]); // Articles from the news API
  const [error, setError] = useState(null); // Error state

  const API_KEY = "d07f7ec21fa34f428ded04e4da44d738"; // Replace with your actual NewsAPI key

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Update search history
    const updatedHistory = [...searchHistory, query];
    setSearchHistory(updatedHistory);

    // Update recommendations with the last five searches
    const updatedRecommendations = updateRecommendations([...recommendations, query]);
    setRecommendations(updatedRecommendations);

    // Update the dashboard with the latest search query
    setDashboard(query);

    // Fetch news articles for the query
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "ok") {
        setNewsArticles(data.articles);
        setError(null);
      } else {
        setError("Unable to fetch news articles. Try again later.");
      }
    } catch (error) {
      setError("An error occurred while fetching news articles.");
    }

    // Clear the query input
    setQuery("");
  };

  const updateRecommendations = (currentRecommendations) => {
    return currentRecommendations.slice(-3); // Keep only the last three searches
  };

  const clearHistory = () => {
    setSearchHistory([]); // Clear only the search history
  };

  const clearDashboard = () => {
    setDashboard(""); // Clear the searched topic in the dashboard
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Search and Recommendation System</h1>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search something..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Search History Section */}
      <div style={styles.historySection}>
        <h2 style={styles.subHeading}>Search History</h2>
        <button onClick={clearHistory} style={styles.clearButton}>
          Clear History
        </button>
        <ul style={styles.list}>
          {searchHistory.length > 0 ? (
            searchHistory.map((item, index) => (
              <li key={index} style={styles.listItem}>
                {item}
              </li>
            ))
          ) : (
            <li style={styles.noData}>No search history yet.</li>
          )}
        </ul>
      </div>

      {/* Dashboard Section - Last Searched Topic */}
      <div style={styles.dashboardSection}>
        <h2 style={styles.subHeading}>Last Searched Topic</h2>
        <button onClick={clearDashboard} style={styles.clearButton}>
          Clear Dashboard
        </button>
        <div style={styles.dashboardTopic}>
          {dashboard ? (
            <span style={styles.dashboardText}>{dashboard}</span>
          ) : (
            <span style={styles.noData}>No topic searched yet.</span>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <div style={styles.recommendationsSection}>
        <h2 style={styles.subHeading}>Recommendations</h2>
        <ul style={styles.list}>
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <li key={index} style={styles.listItem}>
                {rec}
              </li>
            ))
          ) : (
            <li style={styles.noData}>No recommendations available.</li>
          )}
        </ul>
      </div>

      {/* News Articles Section */}
      <div style={styles.newsSection}>
        <h2 style={styles.subHeading}>News Articles</h2>
        <ul style={styles.list}>
          {newsArticles.length > 0 ? (
            newsArticles.map((article, index) => (
              <li key={index} style={styles.listItem}>
                <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  {article.title}
                </a>
              </li>
            ))
          ) : (
            <li style={styles.noData}>No news articles found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  searchBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "#DC3545",
    textAlign: "center",
    marginBottom: "20px",
  },
  historySection: {
    marginBottom: "20px",
  },
  recommendationsSection: {
    marginBottom: "20px",
  },
  newsSection: {
    marginBottom: "20px",
  },
  dashboardSection: {
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "10px",
  },
  clearButton: {
    padding: "5px 10px",
    backgroundColor: "#DC3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    padding: "8px 12px",
    marginBottom: "5px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  noData: {
    textAlign: "center",
    color: "#999",
  },
  dashboardTopic: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  dashboardText: {
    fontSize: "1.1rem",
    color: "#333",
  },
  link: {
    textDecoration: "none",
    color: "#007BFF",
  },
};

export default Search;
