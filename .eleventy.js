const { DateTime} = require("luxon");


module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addFilter("postDate", (dateObj) => {
      return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    })

    eleventyConfig.addFilter("getNextItem", function(collection, currentItem) {
      const index = collection.indexOf(currentItem);
      return collection[index + 1] || null;
    });

    eleventyConfig.addFilter("split", function(str, delimiter) {
      return str.split(delimiter);
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
    
  return {
    dir : {
      input: "src",
      includes: "_includes",
      output: "public"
    }
  }
}