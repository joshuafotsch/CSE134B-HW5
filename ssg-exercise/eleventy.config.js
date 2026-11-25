export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("theme.js");
  eleventyConfig.addPassthroughCopy("hello-world.js");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.ignores.add("README.md");
}
