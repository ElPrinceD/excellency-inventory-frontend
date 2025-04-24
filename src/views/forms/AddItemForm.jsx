import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    item_id: '',
    name: '',
    price_per_kg: '',
    weight: '',
    total: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    setError('You must be logged in to add an item.');
    return;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    if (name === 'price_per_kg' || name === 'weight') {
      const price = parseFloat(updatedForm.price_per_kg || 0);
      const weight = parseFloat(updatedForm.weight || 0);
      updatedForm.total = (price * weight);
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post('https://excellencycatering.com/api/items/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Item purchase added successfully!');
      setFormData({
        date: '',
        item_id: '',
        name: '',
        price_per_kg: '',
        weight: '',
        total: '',
      });
    } catch (err) {
      setError('Error adding item purchase');
      console.error(err);
    }
  };

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Item Purchase</Card.Title>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Item ID</Form.Label>
                <Form.Control
                  type="text"
                  name="item_id"
                  placeholder="Enter Item ID"
                  value={formData.item_id}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Item Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price per Kg</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price_per_kg"
                  placeholder="Enter Price per Kg"
                  value={formData.price_per_kg}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="weight"
                  placeholder="Enter Weight (kg)"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="total"
                  placeholder="Total"
                  value={formData.total}
                  readOnly
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddItemForm;