async function formatDataToJson(data) {
  try {
    // Replace &quot; with " for proper JSON parsing
    const cleanedData = data
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/&#92;/g, "\\") // Replace &#92; with \
      .replace(/&#x2F;/g, "/") // Replace &#x2F; with /
      .replace(/&#x5C;/g, "\\") // Replace &#x5C; with \ 
      .replace(/&#x26;/g, "&"); // Replace &#x26; with & 

    // Check if the data starts with an array and ends with an array, indicating it's an array
    if (cleanedData.trim().startsWith('[') && cleanedData.trim().endsWith(']')) {
      // Parse the cleaned data into an array of objects
      const parsedData = JSON.parse(cleanedData);

      // Now, ensure that each item is properly parsed into an object
      const parsedDocs = parsedData.map(doc => JSON.parse(doc));  // Parse each string into an object

      return parsedDocs;  // Return the array of objects
    } else {
      throw new Error("Input data is not a valid array.");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}


async function initSearch() {
  try {
    const response = await fetch('/search.json');
    // console.log("this is a response", response.text());
    const textResponse = await response.text();
    console.log("this is a text response", textResponse);

    if (!response.ok) {
      throw new Error('Failed to fetch search.json');
    }

    console.log("we are making it this far");

    const searchIndex = await formatDataToJson(textResponse);  // Await the result of formatDataToJson
    console.log("Search Index:", searchIndex); 
    if (!searchIndex) {
      throw new Error('Invalid search index data.');
    }

    const idx = lunr(function () {
      this.field('title');
      this.field('description');
      this.ref('url');

      searchIndex.forEach((doc) => this.add(doc));  // Now searchIndex is an array
    });

    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default Enter key behavior
      }
    });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();

      // Only show results if the user has typed at least one character
      if (query.length === 0) {
        searchResults.innerHTML = ''; // Clear results for empty input
        return;
      }

      const results = idx.search(query);

      if (results.length === 0) {
        searchResults.innerHTML = '<li>No results found</li>';
      } else {
        searchResults.innerHTML = results
          .map((result) => {
            const item = searchIndex.find((doc) => doc.url === result.ref);
            return `<li><a href="${item.url}">${item.title}</a></li>`;
          })
          .join('');
      }
    });
  } catch (error) {
    console.error("Error loading search JSON:", error);
  }
}

document.addEventListener('DOMContentLoaded', initSearch);
