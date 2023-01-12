const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  const testUsers = [helper.authorizedUser, helper.unauthorizedUser].map(
    (user) => new User(user)
  );
  const userArr = testUsers.map((user) => user.save());
  await Promise.all(userArr);

  const authorizedUser = await User.findOne({
    username: helper.authorizedUser.username,
  });

  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: authorizedUser._id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("Go To Statement Considered Harmful");
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;

    for (let blog of blogs) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("addition of a new blog", () => {
  test("blog can't be added when request missing token", async () => {
    const newBlog = {
      title: "Create New Blog Test",
      author: "username",
      url: "http://test.com",
      likes: 1,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  test("a valid blog can be added", async () => {
    const blogCreator = helper.authorizedUser;
    const creatorToken = await helper.getUserToken(blogCreator.username);
    const newBlog = {
      title: "Create New Blog Test",
      author: blogCreator.username,
      url: "http://test.com",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain("Create New Blog Test");
  });

  test("if the likes property is missing from the request, it will default to the value 0", async () => {
    const blogCreator = helper.authorizedUser;
    const creatorToken = await helper.getUserToken(blogCreator.username);
    const newBlogWithoutLikes = {
      title: "Create New Blog Without Likes Test",
      author: blogCreator.username,
      url: "http://test.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const newBlog = blogsAtEnd.find(
      (blog) => blog.title === "Create New Blog Without Likes Test"
    );
    expect(newBlog).toBeDefined();
    expect(newBlog.likes).toBe(0);
  });

  test("if the title or url properties are missing from the request data, the backend responds status code 400", async () => {
    const blogCreator = helper.authorizedUser;
    const creatorToken = await helper.getUserToken(blogCreator.username);
    const missingTitleBlog = {
      author: blogCreator.username,
      likes: 1,
      url: "http://test.com",
    };

    await api
      .post("/api/blogs")
      .send(missingTitleBlog)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(400);

    const missingUrlBlog = {
      title: "Create Invalid Blog Test",
      author: blogCreator.username,
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .send(missingUrlBlog)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const blogCreator = helper.authorizedUser;
    const creatorToken = await helper.getUserToken(blogCreator.username);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const ids = blogsAtEnd.map((r) => r.id);

    expect(ids).not.toContain(blogToDelete.id);
  });
});

describe("update a blog", () => {
  test("succeeds with status code 200 if id and content are valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newBlogContent = {
      title: "Updated blog ",
      author: "Updated author",
      url: "http://updated-url.com",
      likes: 100,
    };
    const blogCreator = helper.authorizedUser;
    const creatorToken = await helper.getUserToken(blogCreator.username);

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogContent)
      .set("Authorization", `bearer ${creatorToken}`)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    expect(updatedBlog).toBeDefined();
    const expectedBlog = { ...blogToUpdate, ...newBlogContent };
    expect(updatedBlog).toEqual(expectedBlog);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
