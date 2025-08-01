const express = require('express'); 
const app = express();
require('dotenv').config();
const path = require('path'); 
const mongoose = require('mongoose');
const Todos = require('./models/todo.models.js');


// Middleware setup
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

app.get('/', async (req, res) => {
  const todos = await Todos.find(); 
  res.render('index',{todos}); 
});

app.post('/add', async (req, res) => {
  const newTodo = new Todos({
    task: req.body.task 
});
  await newTodo.save();
  res.redirect('/'); 
});


app.get('/toggle/:id', async (req, res) => {
  const todo = await Todos.findById(req.params.id);
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
app.listen(process.env.PORT || 2000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});