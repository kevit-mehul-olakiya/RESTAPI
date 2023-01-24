const express = require('express');
const app = express();

app.get('/user-posts-comments', async (req, res) => {
  const { username } = req.query;

  // Fetch the list of users
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await usersResponse.json();

  // Filter the list of users to find the user with the matching username
  const user = users.filter((user) => user.username === username)[0];
 
  
  // Fetch the list of posts
  const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await postsResponse.json();
  
  // Filter the list of posts to find the posts that have a userId field that matches the user's id
  const userPosts = posts.filter((post) => post.userId === user.id);
  // Fetch the list of comments
  const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
  const comments = await commentsResponse.json();

  // Filter the list of comments to find the comments that have a postId field that matches the post's id
  const userPostsComments = comments.filter((comment) => userPosts.find((post)=> post.id === comment.postId));
 
  res.json({ 
    username: user.username,
    name:user.name,
    email:user.email,
    city:user.address.city,
    userPosts: userPosts, 
    userPostsComments: userPostsComments });
});

app.listen(3000, () => console.log('Server started on port 3000'));
