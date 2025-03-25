import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ item_name: '', supplier_name: '', total_quantity: '' });

  useEffect(() => {
    const fetchItemDetails = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to view item details.');
        setLoading(false);
        return;
      }

      try {
        const stockResponse = await axios.get(`https://excellencycatering.com/api/stocks/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const transResponse = await axios.get(`https://excellencycatering.com/api/stocks/${id}/transactions/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setItem(stockResponse.data);
        setTransactions(transResponse.data);
        setFormData({
          item_name: stockResponse.data.item_name,
          supplier_name: stockResponse.data.supplier_name,
          total_quantity: stockResponse.data.total_quantity,
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleEdit = () => setEditing(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`https://excellencycatering.com/api/stocks/${id}/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setItem({ ...item, ...formData });
      setEditing(false);
    } catch (err) {
      setError('Failed to update item.');
    }
  };

  const currentStock = transactions.reduce((acc, entry) => {
    return entry.transaction_type === 'IN' ? acc + entry.quantity : acc - entry.quantity;
  }, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Item Details: {item.item_name}</Card.Title>
            <Button variant="secondary" onClick={() => navigate(-1)} style={{ float: 'right' }}>Back to List</Button>
            <Button variant="primary" onClick={handleEdit} style={{ float: 'right', marginRight: '10px' }}>Edit</Button>
          </Card.Header>
          <Card.Body>
            {!editing ? (
              <>
                <Row>
                  <Col md={6}>
                    <h5>General Information</h5>
                    <p><strong>Name:</strong> {item.item_name}</p>
                    <p><strong>Supplier:</strong> {item.supplier_name}</p>
                    <p><strong>Total Quantity:</strong> {item.total_quantity} {item.unit}</p>
                    <p><strong>Unit Type:</strong> {item.unit}</p>
                    <p><strong>Current Stock:</strong> {currentStock} {item.unit}</p>
                  </Col>
                  <Col md={6}>
                    <h5>Additional Details</h5>
                    <p><strong>Last Updated:</strong> {new Date(item.last_updated).toLocaleDateString()}</p>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <h5>Stock History</h5>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>In</th>
                          <th>Out</th>
                          <th>Net Change</th>
                          <th>User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((entry) => (
                          <tr key={entry.id}>
                            <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                            <td style={{ color: 'green' }}>{entry.transaction_type === 'IN' ? entry.quantity : 0}</td>
                            <td style={{ color: 'red' }}>{entry.transaction_type === 'OUT' ? entry.quantity : 0}</td>
                            <td>{entry.transaction_type === 'IN' ? entry.quantity : -entry.quantity}</td>
                            <td>{entry.user}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            ) : (
              <Form>
                <Form.Group>
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control type="text" name="item_name" value={formData.item_name} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Supplier Name</Form.Label>
                  <Form.Control type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Total Quantity</Form.Label>
                  <Form.Control type="number" name="total_quantity" value={formData.total_quantity} onChange={handleChange} />
                </Form.Group>
                <Button variant="success" onClick={handleSave} className="mt-3">Save</Button>
                <Button variant="secondary" onClick={() => setEditing(false)} className="mt-3 ml-2">Cancel</Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ItemDetail;
