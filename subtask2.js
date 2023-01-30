const express = require('express');
const app = express();

app.get('/comments-to-user', async (req, res) => {
    const { email, name } = req.query;

 try {
       // fetch comments
       const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
       const comments = await commentsResponse.json();
   
       const comment = comments.filter((comment) => comment.email === email && comment.name === name)
   
       if (comment === undefined) {
           res.status(404).send(`${email} and ${name} is not found`)
       }
       // console.log(comment);
   
       // fetch post
       const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
       const posts = await postsResponse.json();
   
       const post = posts.filter((post) => comment.find((comment) => post.id === comment.postId))
       // console.log(post);
       if (post === undefined) {
           res.status(404).send(`${email} and ${name} is not found`)
       }
   
       // fetch user
       const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
       const users = await usersResponse.json();
   
       const user = users.filter((user) => post.find((post) => post.userId === user.id))[0]
       if (user === undefined) {
           res.status(400).send({
               error: `${email} and ${name} is not found`
           })
       }
   
       // console.log(user);
   
       res.json({
           username: user.username,
           name: user.name,
           email: user.email
       })
 } catch (error) {
    res.status(500).send(error)
 }
})
app.listen(3000, () => console.log('Server started on port 3000'));