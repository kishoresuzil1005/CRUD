const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items = [];

// Home - List
app.get('/', (req, res) => {
  res.render('index', { items });
});

// Add
app.post('/add', (req, res) => {
  const { name, description } = req.body;
  items.push({ id: Date.now(), name, description });
  res.redirect('/');
});

// Delete
app.post('/delete/:id', (req, res) => {
  items = items.filter(item => item.id != req.params.id);
  res.redirect('/');
});

// Edit Page
app.get('/edit/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  res.render('edit', { item });
});

// Update
app.post('/update/:id', (req, res) => {
  const { name, description } = req.body;
  items = items.map(item => {
    if (item.id == req.params.id) {
      return { ...item, name, description };
    }
    return item;
  });
  res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));



