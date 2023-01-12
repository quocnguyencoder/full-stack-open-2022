const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  let blogFromRequest = request.body;
  const isValidBlog =
    blogFromRequest.title !== undefined && blogFromRequest.url !== undefined;

  const user = request.user;

  if (isValidBlog) {
    const haveLikes = blogFromRequest.likes !== undefined;
    blogFromRequest = haveLikes
      ? blogFromRequest
      : { ...blogFromRequest, likes: 0 };

    const blog = new Blog({ ...blogFromRequest, user: user._id });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    response.status(400).json({ error: "invalid request" });
    return;
  }

  if (blog.user.toString() !== user._id.toString()) {
    response.status(401).json({ error: "unauthorized token" });
    return;
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const body = request.body;
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);

  if (!blog) {
    response.status(400).json({ error: "invalid request" });
    return;
  }

  if (blog.user.toString() !== user._id.toString()) {
    response.status(401).json({ error: "unauthorized token" });
    return;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
    new: true,
  });

  updatedBlog
    ? response.status(200).json(updatedBlog.toJSON())
    : response.status(404).end();
});

module.exports = blogsRouter;
