import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const EditWeddingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [wedding, setWedding] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: 'AM',
    hall: '',
    number_of_guests: '',
    additional_info: '',
    selectedDishes: {
      salad: [],
      starter: [],
      rice: [],
      curry: [],
      main_course: [],
      sauce: [],
      dessert: [],
      drink: [],
    }
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const [hallRes, dishRes, weddingRes] = await Promise.all([
          axios.get('https://excellencycatering.com/api/halls/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://excellencycatering.com/api/dishes/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://excellencycatering.com/api/weddings/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setHalls(hallRes.data);
        setDishes(dishRes.data);
        setWedding(weddingRes.data);

        const selected = {
          salad: [],
          starter: [],
          rice: [],
          curry: [],
          main_course: [],
          sauce: [],
          dessert: [],
          drink: [],
        };

        weddingRes.data.dishes.forEach(dish => {
          selected[dish.dish_type].push(dish.id);
        });

        setFormData({
          name: weddingRes.data.name,
          date: weddingRes.data.date,
          time: weddingRes.data.time,
          hall: weddingRes.data.hall.id,
          number_of_guests: weddingRes.data.number_of_guests,
          additional_info: weddingRes.data.additional_info || '',
          selectedDishes: selected,
        });

      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleDishSelect = (category, dishId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDishes[category].includes(dishId);
      const updated = isSelected
        ? prev.selectedDishes[category].filter(id => id !== dishId)
        : [...prev.selectedDishes[category], dishId];

      return {
        ...prev,
        selectedDishes: {
          ...prev.selectedDishes,
          [category]: updated,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const allSelectedDishIds = Object.values(formData.selectedDishes).flat();

    try {
      await axios.put(
        `https://excellencycatering.com/api/weddings/${id}/`,
        {
          name: formData.name,
          date: formData.date,
          time: formData.time,
          hall: formData.hall,
          number_of_guests: parseInt(formData.number_of_guests),
          dishes: allSelectedDishIds,
          additional_info: formData.additional_info,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Wedding updated successfully!');
      setTimeout(() => navigate(`/weddings/${id}`), 1500);
    } catch (err) {
      setError('Failed to update wedding.');
    }
  };

  if (!wedding) return <div>Loading...</div>;

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>Edit Wedding: {formData.name}</Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Wedding Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Hall</Form.Label>
                <Form.Select
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                >
                  <option>Select a hall</option>
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.number_of_guests}
                  onChange={(e) => setFormData({ ...formData, number_of_guests: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Additional Info</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                />
              </Form.Group>

              {/* Dishes section */}
              {Object.keys(formData.selectedDishes).map((category) => (
                <Form.Group key={category} className="mt-4">
                  <Form.Label>{category.replace('_', ' ').toUpperCase()}</Form.Label>
                  <div>
                    {dishes
                      .filter(dish => dish.dish_type === category)
                      .map(dish => (
                        <Form.Check
                          inline
                          key={dish.id}
                          label={dish.name}
                          type="checkbox"
                          checked={formData.selectedDishes[category].includes(dish.id)}
                          onChange={() => handleDishSelect(category, dish.id)}
                        />
                      ))}
                  </div>
                </Form.Group>
              ))}

              <Button type="submit" className="mt-4">Update Wedding</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EditWeddingForm;
