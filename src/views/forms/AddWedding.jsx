import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Dropdown, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddWeddingForm = () => {
  const [halls, setHalls] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null); // Store hall ID
  const [selectedTime, setSelectedTime] = useState('AM');
  const [selectedDate, setSelectedDate] = useState('');
  const [weddingName, setWeddingName] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedDishes, setSelectedDishes] = useState({
    salad: [],
    starter: [],
    rice: [],
    curry: [],
    main_course: [],
    sauce: [],
    dessert: [],
    drink: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('You must be logged in to add a wedding.');
          return;
        }

        const hallsResponse = await axios.get('https://excellencycatering.com/api/halls/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHalls(hallsResponse.data);

        const dishesResponse = await axios.get('https://excellencycatering.com/api/dishes/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setDishes(dishesResponse.data);
      } catch (err) {
        setError('Failed to fetch data from the server.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDishSelect = (category, dishId) => {
    setSelectedDishes((prev) => {
      const newSelection = prev[category].includes(dishId)
        ? prev[category].filter((d) => d !== dishId)
        : [...prev[category], dishId];
      return { ...prev, [category]: newSelection };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedDate || !selectedHall || !weddingName || !numberOfGuests) {
      setError('All required fields (name, hall, date, number of guests) must be filled.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You must be logged in to add a wedding.');
      return;
    }

    const allSelectedDishIds = Object.values(selectedDishes).flat();

    try {
      await axios.post(
        'https://excellencycatering.com/api/weddings/',
        {
          name: weddingName,
          date: selectedDate,
          time: selectedTime,
          hall: selectedHall,
          number_of_guests: parseInt(numberOfGuests, 10),
          dishes: allSelectedDishIds,
          additional_info: additionalInfo || null,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Wedding added successfully!');
      setWeddingName('');
      setSelectedHall(null);
      setSelectedDate('');
      setSelectedTime('AM');
      setNumberOfGuests('');
      setAdditionalInfo('');
      setSelectedDishes({
        salad: [],
        starter: [],
        rice: [],
        curry: [],
        main_course: [],
        sauce: [],
        dessert: [],
        drink: [],
      });
    } catch (err) {
      setError('Failed to add wedding. Please try again.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Wedding</Card.Title>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Wedding Name</Form.Label>
                <Form.Control
                  type="text"
                  value={weddingName}
                  onChange={(e) => setWeddingName(e.target.value)}
                  placeholder="Enter wedding name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hall</Form.Label>
                <Dropdown onSelect={(eventKey) => setSelectedHall(parseInt(eventKey, 10))}>
                  <Dropdown.Toggle variant="outline-secondary">
                    {selectedHall ? halls.find((h) => h.id === selectedHall)?.name : 'Select Hall'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {halls.map((hall) => (
                      <Dropdown.Item key={hall.id} eventKey={hall.id}>
                        {hall.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Dropdown onSelect={(eventKey) => setSelectedTime(eventKey)}>
                  <Dropdown.Toggle variant="outline-secondary">{selectedTime}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="AM">AM</Dropdown.Item>
                    <Dropdown.Item eventKey="PM">PM</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  placeholder="Enter number of guests"
                  min="1"
                  required
                />
              </Form.Group>

              {['salad', 'starter', 'rice', 'curry', 'main_course', 'sauce', 'dessert', 'drink'].map((category) => (
                <Form.Group className="mb-3" key={category}>
                  <Form.Label>{category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}</Form.Label>
                  <div
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      padding: '10px',
                    }}
                  >
                    {dishes
                      .filter((dish) => dish.dish_type === category)
                      .map((dish) => (
                        <Form.Check
                          key={dish.id}
                          type="checkbox"
                          id={`${category}-${dish.id}`}
                          label={dish.notes ? `${dish.name} (${dish.notes})` : dish.name}
                          checked={selectedDishes[category].includes(dish.id)}
                          onChange={() => handleDishSelect(category, dish.id)}
                        />
                      ))}
                    {dishes.filter((dish) => dish.dish_type === category).length === 0 && (
                      <span className="text-muted">No {category.replace('_', ' ')} available</span>
                    )}
                  </div>
                  <div className="mt-2">
                    {selectedDishes[category].map((dishId) => {
                      const dish = dishes.find((d) => d.id === dishId);
                      return (
                        <span key={dishId} className="badge bg-primary me-1">
                          {dish ? (dish.notes ? `${dish.name} (${dish.notes})` : dish.name) : dishId}
                        </span>
                      );
                    })}
                  </div>
                </Form.Group>
              ))}

              <Form.Group className="mb-3">
                <Form.Label>Additional Info</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Enter any additional info (e.g., dietary requirements)"
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

export default AddWeddingForm;