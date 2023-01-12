const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const unauthorizedUser = {
  username: "unauthorized",
  name: "Unauthorized User",
  password: "unauthorized",
};

const authorizedUser = {
  username: "authorized",
  name: "Authorized User",
  password: "authorized",
};

const getUserToken = async (username) => {
  const user = await User.findOne({ username });

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return token;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  getUserToken,
  authorizedUser,
  unauthorizedUser,
};
