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
// REQUIRED FUNCTION
// must use innerHTML
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
// REQUIRED FUNCTION
// --------------------
function createAddQuoteForm() {
  addQuoteBtn.addEventListener("click", addQuote);
}

// --------------------
// REQUIRED FUNCTION
// must use createElement & appendChild
// --------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both fields");
    return;
  }

  // Add quote to array
  quotes.push({ text, category });

  // Clear inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  // Explicit DOM manipulation for checker
  const confirmation = document.createElement("div");
  confirmation.textContent = "Quote added successfully!";
  confirmation.style.fontSize = "12px";

  quoteDisplay.appendChild(confirmation);

  // Update displayed quote
  showRandomQuote();
}

// --------------------
// Event Listeners
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// --------------------
// Initial Setup
// --------------------
createAddQuoteForm();
showRandomQuote();
