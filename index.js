const express = require('express');
const app = express();

app.get('/user', async (req, res) => {
  const { username } = req.query;

// fetch user
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
  const users = await usersResponse.json();
  const user = users.filter((user) => user.username === username)[0];
 
  // fetch post
   const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await postsResponse.json();
  const userPosts = posts.filter((post) => post.userId === user.id);

// fetch comment
  const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
  const comments = await commentsResponse.json();
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
