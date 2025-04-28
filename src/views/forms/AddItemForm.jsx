// AddItemForm.js
import React, { useEffect, useState } from 'react';
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
    company: null,
  });

  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://excellencycatering.com/api/companies/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === 'price_per_kg' || name === 'weight') {
      const price = parseFloat(updatedForm.price_per_kg || 0);
      const weight = parseFloat(updatedForm.weight || 0);
      updatedForm.total = (price * weight).toFixed(2);
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        'https://excellencycatering.com/api/items/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Item purchase added successfully!');
      setFormData({
        date: '',
        item_id: '',
        name: '',
        price_per_kg: '',
        weight: '',
        total: '',
        company: null,
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
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Select
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price per Kg</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price_per_kg"
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
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Item
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddItemForm;
