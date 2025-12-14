// --------------------
// Quotes Data
// --------------------
const quotes = [
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
// REQUIRED FUNCTION NAME
// --------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

// --------------------
// Add Quote
// --------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both fields");
    return;
  }

  quotes.push({ text, category });

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  showRandomQuote();
}

// --------------------
// Event Listeners
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// --------------------
// Initial Quote
// --------------------
showRandomQuote();
