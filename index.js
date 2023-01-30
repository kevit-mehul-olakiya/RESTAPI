const express = require('express');
const app = express();
app.use(express.json())
app.get('/user', async (req, res) => {
  const { username } = req.query;

try {
    // fetch user
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
  const users = await usersResponse.json();

  // fetch post
   const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await postsResponse.json();

// fetch comment
  const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
  const comments = await commentsResponse.json();
 
 
  let postToComment = {}
  let userToPost = {}
  let user = {}
  for(let i=0;i<comments.length;i++){
      if(!postToComment[comments[i].postId]){
          postToComment[comments[i].postId] = []
          postToComment[comments[i].postId].push( {
              name:comments[i].name,
              body:comments[i].body
          })
      }
      else{
          postToComment[comments[i].postId].push( {
              name:comments[i].name,
              body:comments[i].body
          })
      }
  }

  for (let i = 0; i <posts.length; i++) {
      if(!userToPost[posts[i].userId]){

          userToPost[posts[i].userId] = []

          userToPost[posts[i].userId].push({

              title:posts[i].title,
              comment:postToComment[posts[i].id]
          })
      }else{
          userToPost[posts[i].userId].push( {

              title:posts[i].title,
              comment:postToComment[posts[i].id]
          })
      }
  }
  for (let i = 0; i <users.length; i++) {
      if(username === users[i].username){
        user = {
            userId:users[i].id,
            name:users[i].name,
            username:users[i].username,
            email:users[i].email,
            city:users[i].address.city,
            post : userToPost[users[i].id]
        }
      }
  }
  if (username !== user.username) {
    return   res.status(400).send({error:`user not found`})  
  }
  return res.send({ 
    user:user
 });
  
} catch (error) {
    res.status(500).send(error)
}
})
//<------------------------------------------------- subtask 2 ------------------------------------->
app.get('/comments-to-user', async (req, res) => {
    const { email, name } = req.query;

 try {
       // fetch comments
       const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
       const comments = await commentsResponse.json();
   
       const comment = comments.filter((comment) => comment.email === email && comment.name === name)
   
       if (!comment) {
        return   res.status(404).send(`${email} and ${name} is not found`)
       }
       // console.log(comment);
   
       // fetch post
       const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
       const posts = await postsResponse.json();
   
       const post = posts.filter((post) => comment.find((comment) => post.id === comment.postId))
       // console.log(post);
       if (!post) {
        return   res.status(404).send(`${email} and ${name} is not found`)
       }
   
       // fetch user
       const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
       const users = await usersResponse.json();
   
       const user = users.filter((user) => post.find((post) => post.userId === user.id))[0]
       if (!user) {
           return res.status(400).send({
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
