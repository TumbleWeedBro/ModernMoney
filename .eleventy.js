module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");

    // defining a collection
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post");
    });
  return {
    dir : {
      input: "src",
      output: "public"
    }
  }
}