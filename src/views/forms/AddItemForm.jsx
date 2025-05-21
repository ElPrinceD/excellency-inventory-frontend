// AddItemForm.js
import React, { useState, useEffect } from 'react';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('https://excellencycatering.com/api/company/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(data);
        console.log('Raw data: ',data)
       
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData };
    console.log('Name: ',name)
    console.log('Value: ',value)

    if (name === 'company') {
      const selectedCompany = companies.find((c) => c.id === parseInt(value));
      updatedForm.company = selectedCompany || null;
    } else {
      updatedForm[name] = value;
    }

    if (name === 'price_per_kg' || name === 'weight') {
      const price = parseFloat(updatedForm.price_per_kg) || 0;
      const weight = parseFloat(updatedForm.weight) || 0;
      updatedForm.total = (price * weight).toFixed(2);
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    console.log('Form Data: ', formData);

    try {
      const payload = {
        date: formData.date,
        item_id: formData.item_id,
        name: formData.name,
        price_per_kg: parseFloat(formData.price_per_kg),
        weight: parseFloat(formData.weight),
        total: parseFloat(formData.total),
        company: formData.company?.id,
      };


      console.log('Payload: ', payload);

      


      await axios.post('https://excellencycatering.com/api/items/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Item added successfully!');
      setFormData({
        date: '',
        item_id: '',
        name: '',
        price_per_kg: '',
        weight: '',
        total: '',
        company: null,
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      setErrorMessage('Failed to add item.');
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
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Item ID</Form.Label>
                <Form.Control type="text" name="item_id" value={formData.item_id} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Select name="company" value={formData.company?.id || ''} onChange={handleInputChange}>
                  <option value="">Select Company</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price per Kg</Form.Label>
                <Form.Control type="number" step="0.01" name="price_per_kg" value={formData.price_per_kg} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Weight</Form.Label>
                <Form.Control type="number" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control type="text" value={formData.total} readOnly />
              </Form.Group>

              <Button variant="primary" type="submit">Add Item</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddItemForm;
