import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddCoffeeShopEventForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    names_of_items: '',
    number_of_guests: '',
    cleaning_price: '',
    ice_cream_price: '',
    staff_number: '',
    total_cost: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to add an event.');
    }
  }, [token]);

  const calculateTotalCost = (data) => {
    const cleaning = parseFloat(data.cleaning_price) || 0;
    const iceCream = parseFloat(data.ice_cream_price) || 0;
    const staff = parseInt(data.staff_number) || 0;
    const guests = parseInt(data.number_of_guests) || 0;

    return (cleaning + iceCream + staff * 50 + guests * 5).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    // Recalculate total cost whenever any relevant field changes
    updatedForm.total_cost = calculateTotalCost(updatedForm);

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axios.post('https://excellencycatering.com/api/coffeshop/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Coffee shop event added successfully!');
      setFormData({
        date: '',
        names_of_items: '',
        number_of_guests: '',
        cleaning_price: '',
        ice_cream_price: '',
        staff_number: '',
        total_cost: '',
      });
    } catch (err) {
      setError('Error adding coffee shop event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Coffee Shop Event</Card.Title>
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
                <Form.Label>Names of Items</Form.Label>
                <Form.Control
                  type="text"
                  name="names_of_items"
                  placeholder="Enter items used in the event"
                  value={formData.names_of_items}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_guests"
                  placeholder="Enter Number of Guests"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cleaning Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cleaning_price"
                  placeholder="Enter Cleaning Price"
                  value={formData.cleaning_price}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ice Cream Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="ice_cream_price"
                  placeholder="Enter Ice Cream Price"
                  value={formData.ice_cream_price}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Staff Number</Form.Label>
                <Form.Control
                  type="number"
                  name="staff_number"
                  placeholder="Enter Staff Number"
                  value={formData.staff_number}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Total Cost</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="total_cost"
                  value={formData.total_cost}
                  disabled
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCoffeeShopEventForm;
