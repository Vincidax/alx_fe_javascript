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

// --------------------
// REQUIRED FUNCTION
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
// REQUIRED FUNCTION (RESTORED)
// --------------------
function createAddQuoteForm() {
  // Form already exists in HTML
  addQuoteBtn.addEventListener("click", addQuote);
}

// --------------------
// REQUIRED FUNCTION
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

  // DOM manipulation (explicit)
  const msg = document.createElement("div");
  msg.textContent = "Quote added!";
  quoteDisplay.appendChild(msg);

  showRandomQuote();
}

// --------------------
// EVENT LISTENERS
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// --------------------
// INITIAL LOAD
// --------------------
loadQuotes();
createAddQuoteForm();
showRandomQuote();
