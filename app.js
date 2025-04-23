const express = require('express'); 
const app = express();
const path = require('path'); 
const mongoose = require('mongoose');
const Todos = require('./models/todo.models.js');


// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse form data
// app.use(express.static('public')); // Serve static files from 'public' folder
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb+srv://Ankit:Ankit123@cluster0.g7a3p7h.mongodb.net')
.then(() => {console.log('MongoDB Connected')})
.catch((err) => {console.log('MongoDB Connection Error:', err)});

app.get('/', async (req, res) => {
  const todos = await Todos.find(); // Database se sab todos lao
  res.render('index',{todos}); // EJS template ko bhejo
});

app.post('/add', async (req, res) => {
  const newTodo = new Todos({ task: req.body.task }); // form se task
  await newTodo.save();
// const addTodo = await req.body.task;
// const todo = new Todos({task: addTodo})
// await todo.save()
  res.redirect('/'); 
});


app.get('/toggle/:id', async (req, res) => {
  const todo = await Todos.findById(req.params.id); // ID se todo dhundho
  todo.completed = !todo.completed; 
  await todo.save();
  res.redirect('/');
});

// Delete todo
app.get('/delete/:id', async (req, res) => {
  try{
    const todo = await Todos.findByIdAndDelete(req.params.id);
  }catch(err){
    console.log("Todo not found or error in operation",err)
  }  
  res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
    await Todos.findByIdAndUpdate(req.params.id ,{task: req.body.newTask}) 
    res.redirect('/');
  });

// Start server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});