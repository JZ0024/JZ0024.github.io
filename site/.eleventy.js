module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('styles')

    return {
        passthroughFileCopy: true
    }
};