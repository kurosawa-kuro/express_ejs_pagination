const express = require('express');
const app = express();
const items = require('./data/items.json');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(items.length / 3);
    const displayedItems = items.slice((currentPage - 1) * 3, currentPage * 3);
    res.render('index', { displayedItems, currentPage, totalPages });
});

app.post('/', (req, res) => {
    const newItem = { id: items.length + 1, name: req.body.name };
    items.push(newItem);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');
    res.render('edit', { item });
});

app.post('/edit/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');
    item.name = req.body.name;
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Item not found');
    items.splice(index, 1);
    res.redirect('/');
});

function getPaginatedItems(items, offset, limit) {
    return items.slice(offset, offset + limit);
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
