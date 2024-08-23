document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const author = document.getElementById('searchInput').value;
  if (author) {
      fetchQuotes(author);
  } else {
      alert("Please enter an author's name");
  }
});

async function fetchQuotes(author) {
  try {
      const response = await fetch(`https://usu-quotes-mimic.vercel.app/api/search?query=${author}`);
      const data = await response.json();
      quotes = data.results; // Assuming 'quotes' is a global array storing the current search results
      displayQuotes([...pinnedQuotes, ...quotes]);
  } catch (error) {
      console.error('Error fetching quotes:', error);
  }
}

function displayQuotes(quotes) {
  const container = document.getElementById('quoteDisplay');
  container.innerHTML = quotes.map(quote => {
      const isPinned = pinnedQuotes.includes(quote);
      return `<div class="quote">
                  <p>${quote.content} - ${quote.author}</p>
                  <button onclick="pinQuote(event, '${quote._id}')">${isPinned ? 'Unpin' : 'Pin'}</button>
              </div>`;
  }).join('');
}

let pinnedQuotes = [];
function pinQuote(event, quoteId) {
  event.preventDefault();

  const quoteIndex = pinnedQuotes.findIndex(quote => quote._id === quoteId);
  
  if (quoteIndex !== -1) {
      const unpinnedQuote = pinnedQuotes.splice(quoteIndex, 1)[0];
      quotes.unshift(unpinnedQuote); // Move the quote to the beginning of the unpinned quotes
  } else {
      let quoteToPin = quotes.find(quote => quote._id === quoteId);
      if (quoteToPin) {
          pinnedQuotes.unshift(quoteToPin); // Add to the beginning of the pinnedQuotes array
          quotes = quotes.filter(quote => quote._id !== quoteId); // Remove the quote from the unpinned list
      }
  }

  displayQuotes([...pinnedQuotes, ...quotes]);
}

window.onload = () => {
  fetchQuotes('random');
};
