const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());


app.use(express.json());

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

const readData = () => {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(' cant read the file:', error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('error :', error);
  }
};


app.get('/data', (req, res) => {
  const data = readData();
  res.json(data);
});


app.post('/data', (req, res) => {
    const newData = req.body;
    const data = readData();
  
    newData.id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  
    data.push(newData);
    writeData(data);
  
    res.status(201).json({ message: 'Data added successfully', data: newData });
  });
  


app.delete('/data/:id', (req, res) => {
const id = parseInt(req.params.id);
let data = readData();

const index = data.findIndex(item => item.id === id);
if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
}

const deletedItem = data.splice(index, 1)[0];
writeData(data);

res.json({ message: 'Item deleted successfully', deleted: deletedItem });
});



app.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  let data = readData();

  const index = data.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

 
  data[index] = { ...data[index], ...updatedData, id: id };

  writeData(data);

  res.json({ message: 'Item updated successfully', updated: data[index] });
});
