let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Why so serious?", category: "Fun" }
];

// --- LOCAL STORAGE ---
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveFilter(category) {
  localStorage.setItem("selectedCategory", category);
}

function loadFilter() {
  return localStorage.getItem("selectedCategory") || "all";
}

// --- POPULATE FILTER DROPDOWN ---
function populateCategories() {
  const categories = quotes.map(q => q.category);
  const uniqueCategories = [...new Set(categories)];

  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const savedFilter = loadFilter();
  filter.value = savedFilter;
}

// --- FILTER & DISPLAY QUOTE ---
function filterQuote() {
  const selected = document.getElementById("categoryFilter").value;
  saveFilter(selected);

  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter(q => q.category === selected);
  }

  const display = document.getElementById("quoteDisplay");
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    display.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  } else {
    display.innerHTML = `<p>No quotes found in this category.</p>`;
  }
}

function showRandomQuote() {
  filterQuote();
}

// --- FORM TO ADD QUOTE ---
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert("Quote added!");

    postQuoteToServer(newQuote); // Send to server

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';
  formDiv.appendChild(quoteInput);

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  formDiv.appendChild(categoryInput);

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// --- EXPORT / IMPORT ---
document.getElementById("exportBtn").addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- MOCK SERVER SYNC ---
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(serverQuotes => {
      return serverQuotes.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
    });
}

function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(() => {
    console.log("Quote posted to server.");
  });
}

function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    quotes = serverQuotes; // Conflict resolution: server wins
    saveQuotes();
    populateCategories();
    filterQuote();

    document.getElementById("syncNotice").textContent =
      "Quotes synced with server. Local data was replaced.";
    setTimeout(() => {
      document.getElementById("syncNotice").textContent = "";
    }, 5000);
  });
}

// --- INITIAL SETUP ---
loadQuotes();
populateCategories();
createAddQuoteForm();
filterQuote();

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("syncNowBtn").addEventListener("click", syncQuotes);

// Auto sync every 30 sec
setInterval(syncQuotes, 30000);
