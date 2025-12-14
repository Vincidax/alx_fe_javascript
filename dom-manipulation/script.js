// --------------------
// Default Quotes
// --------------------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Knowledge is power.", category: "Education" }
];

// --------------------
// DOM Elements
// --------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");

// --------------------
// Server Simulation URL
// --------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock endpoint

// --------------------
// LOCAL STORAGE
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save last selected filter
function saveLastFilter(category) {
  localStorage.setItem("lastCategoryFilter", category);
}

function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// --------------------
// SESSION STORAGE
// --------------------
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// --------------------
// Populate Categories
// --------------------
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  loadLastFilter();
}

// --------------------
// Show Random Quote
// --------------------
function showRandomQuote() {
  let filteredQuotes = quotes;

  const selectedCategory = categoryFilter.value;
  if (selectedCategory && selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  saveLastViewedQuote(quote);
}

// --------------------
// Filter Quotes
// --------------------
function filterQuotes() {
  saveLastFilter(categoryFilter.value);
  showRandomQuote();
}

// --------------------
// Add Quote
// --------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  populateCategories();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  const msg = document.createElement("div");
  msg.textContent = "Quote added!";
  quoteDisplay.appendChild(msg);

  showRandomQuote();
}

// --------------------
// Export Quotes to JSON
// --------------------
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// --------------------
// Import Quotes from JSON
// --------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: must be an array of quotes.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();

      populateCategories();

      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (error) {
      alert("Error reading JSON file: " + error.message);
    }
  };

  reader.readAsText(file);
}

// --------------------
// Fetch Quotes From Server
// --------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    return data.slice(0, 10).map(item => ({
      text: item.title,
      category: item.body || "Uncategorized"
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// --------------------
// Sync Quotes with Server
// --------------------
async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  let conflictsResolved = 0;

  serverQuotes.forEach(serverQuote => {
    const index = quotes.findIndex(q => q.text === serverQuote.text);

    if (index === -1) {
      quotes.push(serverQuote);
    } else {
      if (quotes[index].category !== serverQuote.category) {
        quotes[index].category = serverQuote.category;
        conflictsResolved++;
      }
    }
  });

  saveQuotes();
  populateCategories();

  if (conflictsResolved > 0) {
    showSyncMessage(`${conflictsResolved} conflicts resolved using server data.`);
  }

  showRandomQuote();
}

// --------------------
// Post Local Quotes to Server
// --------------------
async function postQuotesToServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });

    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

    const result = await response.json();
    console.log("Quotes posted to server:", result);

    showSyncMessage("Local quotes successfully posted to server!");
  } catch (error) {
    console.error("Error posting quotes to server:", error);
  }
}

// --------------------
// Show Sync/Conflict Message
// --------------------
function showSyncMessage(message) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.color = "green";
  msg.style.marginTop = "10px";
  quoteDisplay.appendChild(msg);

  setTimeout(() => msg.remove(), 5000);
}

// --------------------
// Event Listeners
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);

// --------------------
// Manual Sync & Post Buttons
// --------------------
const syncBtn = document.createElement("button");
syncBtn.textContent = "Sync with Server";
syncBtn.style.marginLeft = "10px";
syncBtn.onclick = syncQuotesWithServer;
document.body.insertBefore(syncBtn, quoteDisplay);

const postBtn = document.createElement("button");
postBtn.textContent = "Post Quotes to Server";
postBtn.style.marginLeft = "10px";
postBtn.onclick = postQuotesToServer;
document.body.insertBefore(postBtn, quoteDisplay);

// --------------------
// Periodic Sync (every 60 sec)
// --------------------
setInterval(syncQuotesWithServer, 60000);

// --------------------
// Initial Load
// --------------------
loadQuotes();
populateCategories();
showRandomQuote();
syncQuotesWithServer();
