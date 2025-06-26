// Step 1: Create an array of quotes
const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Why so serious?", category: "Fun" }
];

// Step 2: Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
}

// Step 3: Link the button to the function
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Step 4: Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText !== "" && newCategory !== "") {
    quotes.push({ text: newText, category: newCategory });
    alert("New quote added!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote and category!");
  }
}
