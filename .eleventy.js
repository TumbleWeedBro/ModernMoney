const { DateTime} = require("luxon");
const fs = require('fs');

function formatDataToJson(data) {
  try {
    // Replace &quot; with " for proper JSON parsing
    const cleanedData = data.replace(/&quot;/g, '"');

    // Parse the cleaned data
    const parsedData = JSON.parse(cleanedData);

    // Check if the parsed data is an array
    if (Array.isArray(parsedData)) {
      return JSON.stringify(parsedData);
    } else {
      throw new Error("Input data is not an array.");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addFilter("postDate", (dateObj) => {
      return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    eleventyConfig.addFilter("getNextItem", function(collection, currentItem) {
      const index = collection.indexOf(currentItem);
      return collection[index + 1] || null;
    });
  
    // Custom filter for getting the previous item in a collection
    eleventyConfig.addFilter("getPreviousItem", function(collection, currentItem) {
      const index = collection.indexOf(currentItem);
      return collection[index - 1] || null;
    });

    eleventyConfig.addCollection("moneyMindset", (collectionApi) => {
      return collectionApi.getFilteredByTag("wealth")
        .concat(collectionApi.getFilteredByTag("mindset"))
        .concat(collectionApi.getFilteredByTag("growth"))
        .concat(collectionApi.getFilteredByTag("success"));
    });
  
    eleventyConfig.addCollection("smartInvesting", (collectionApi) => {
      return collectionApi.getFilteredByTag("invest")
        .concat(collectionApi.getFilteredByTag("strategy"))
        .concat(collectionApi.getFilteredByTag("value"))
        .concat(collectionApi.getFilteredByTag("diversify"));
    });
  
    eleventyConfig.addCollection("budgetingHacks", (collectionApi) => {
      return collectionApi.getFilteredByTag("tips")
        .concat(collectionApi.getFilteredByTag("finance"))
        .concat(collectionApi.getFilteredByTag("budget"))
        .concat(collectionApi.getFilteredByTag("savings"));
    });

    eleventyConfig.addFilter("jsonify", function (value) {
      return JSON.stringify(value);
    });
    
    eleventyConfig.addCollection("search", function (collectionApi) {
      return collectionApi.getFilteredByGlob("src/blog/*.md").map((item) => {
        let result = JSON.stringify({
          title: item.data.title || "No Title",
          description: item.data.description || "",
          url: item.url,
        });
        return result;
      });
    });
    

    eleventyConfig.on('eleventy.after', ({ dir }) => {
      const searchIndex = eleventyConfig.collections.searchIndex;
      if (searchIndex && searchIndex.length) {
        fs.writeFileSync(`${dir.output}/search.json`, JSON.stringify(searchIndex, null, 2));
      }
    });
    

  return {
    dir : {
      input: "src",
      includes: "_includes",
      output: "public"
    }
  }
}