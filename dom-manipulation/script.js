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
const importFileInput = document.getElementById("importFile");

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

// --------------------
// SESSION STORAGE
// --------------------
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small>Category: ${quote.category}</small>
    `;
    return true;
  }
  return false;
}

// --------------------
// DISPLAY RANDOM QUOTE
// --------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  saveLastViewedQuote(quote);
}

// --------------------
// ADD QUOTE
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

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  showRandomQuote();
}

// --------------------
// JSON EXPORT
// --------------------
function exportQuotesToJson() {
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
// JSON IMPORT
// --------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);

    if (!Array.isArray(importedQuotes)) {
      alert("Invalid JSON format");
      return;
    }

    quotes.push(...importedQuotes);
    saveQuotes();

    alert("Quotes imported successfully!");
    showRandomQuote();
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// EVENT LISTENERS
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// --------------------
// INITIAL LOAD
// --------------------
loadQuotes();

if (!loadLastViewedQuote()) {
  showRandomQuote();
}
