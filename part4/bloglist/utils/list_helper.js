const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const totalBlogsByAuthor = _.countBy(blogs, "author");
  const mostBlogsAuthor = Object.entries(totalBlogsByAuthor).sort(
    ([, a], [, b]) => b - a
  )[0];
  return { author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthor = _.groupBy(blogs, "author");

  const mostLikesAuthor = Object.entries(blogsByAuthor)
    .map((info) => [info[0], _.sumBy(info[1], "likes")])
    .sort(([, a], [, b]) => b - a)[0];

  return { author: mostLikesAuthor[0], likes: mostLikesAuthor[1] };
};

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
};
