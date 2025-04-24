import React, { useState } from 'react';
import { Form, Button, Card, Col, Row, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddCoffeeShopEvent = () => {
  const [form, setForm] = useState({
    date: '',
    names_of_items: '',
    number_of_guests: '',
    other_counter_price: '',
    cleaning_price: '',
    ice_cream_price: '',
    staff_number: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalCost = () => {
    const { other_counter_price, cleaning_price, ice_cream_price } = form;
    return (
      parseFloat(other_counter_price || 0) +
      parseFloat(cleaning_price || 0) +
      parseFloat(ice_cream_price || 0)
    ).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total_cost = calculateTotalCost();

    try {
      await axios.post(
        'https://excellencycatering.com/api/coffeshop/',
        { ...form, total_cost },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Event added successfully!');
      setError('');
      setForm({
        date: '',
        names_of_items: '',
        number_of_guests: '',
        other_counter_price: '',
        cleaning_price: '',
        ice_cream_price: '',
        staff_number: '',
      });
    } catch (err) {
      setError('Failed to add event. Please check your input.');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={8}>
        <Card>
          <Card.Header>
            <Card.Title>Add Coffee Shop Event</Card.Title>
          </Card.Header>
          <Card.Body>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Names of Items</Form.Label>
                <Form.Control
                  type="text"
                  name="names_of_items"
                  value={form.names_of_items}
                  onChange={handleChange}
                  placeholder="e.g., Coffee, Sandwiches"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_guests"
                  value={form.number_of_guests}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Other Counter Price (£)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="other_counter_price"
                  value={form.other_counter_price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cleaning Price (£)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cleaning_price"
                  value={form.cleaning_price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ice Cream Price (£)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="ice_cream_price"
                  value={form.ice_cream_price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Staff Number</Form.Label>
                <Form.Control
                  type="number"
                  name="staff_number"
                  value={form.staff_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Total Cost</Form.Label>
                <Form.Control
                  type="text"
                  value={`£${calculateTotalCost()}`}
                  readOnly
                  disabled
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Event
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCoffeeShopEvent;
