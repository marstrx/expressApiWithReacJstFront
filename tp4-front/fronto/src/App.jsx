import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = 'http://localhost:3000/data';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get(apiUrl);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setIsLoading(true);
    setError('');
    try {
      await axios.delete(`${apiUrl}/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Failed to delete data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  const handleCancel = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: '8px', flex: 1 }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ padding: '8px', flex: 2 }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          {editingId ? (isLoading ? 'Updating...' : 'Update') : (isLoading ? 'Adding...' : 'Add')}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={isLoading}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
          >
            Cancel
          </button>
        )}
      </form>

      {isLoading && !data.length ? (
        <div>Loading data...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.map(item => (
            <li key={item.id} style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{item.name}</strong> - {item.description}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => handleEdit(item)} 
                  disabled={isLoading}
                  style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  disabled={isLoading}
                  style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;