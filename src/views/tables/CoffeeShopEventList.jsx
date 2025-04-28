import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CoffeeShopEventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken');
  console.log(token)

  useEffect(() => {

    if (!token) {
      setError('You must be logged in to view events.');
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://excellencycatering.com/api/coffeshop/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load coffee shop events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleEdit = (event) => {
    setSelectedEvent({ ...event });
    setEditSuccess('');
    setEditError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const total_cost = (
      parseFloat(selectedEvent.other_counter_price || 0) +
      parseFloat(selectedEvent.cleaning_price || 0) +
      parseFloat(selectedEvent.ice_cream_price || 0)
    ).toFixed(2);

    try {
      await axios.put(
        `https://excellencycatering.com/api/coffeshop/${selectedEvent.id}/`,
        { ...selectedEvent, total_cost },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditSuccess('Event updated successfully!');
      setEditError('');
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === selectedEvent.id ? { ...selectedEvent, total_cost } : e))
      );
      setShowModal(false);
    } catch (err) {
      setEditError('Failed to update event.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Coffee Shop Events</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Guests</th>
                    <th>Other Price</th>
                    <th>Cleaning</th>
                    <th>Ice Cream</th>
                    <th>Staff</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => {
                    const total =
                      parseFloat(event.other_counter_price || 0) +
                      parseFloat(event.cleaning_price || 0) +
                      parseFloat(event.ice_cream_price || 0);

                    return (
                      <tr key={event.id}>
                        <td>{index + 1}</td>
                        <td>{event.date}</td>
                        <td>{event.names_of_items || 'N/A'}</td>
                        <td>{event.number_of_guests}</td>
                        <td>£{event.other_counter_price}</td>
                        <td>£{event.cleaning_price}</td>
                        <td>£{event.ice_cream_price}</td>
                        <td>{event.staff_number}</td>
                        <td>£{total.toFixed(2)}</td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleEdit(event)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Coffee Shop Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          {selectedEvent && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={selectedEvent.date}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Items</Form.Label>
                <Form.Control
                  type="text"
                  name="names_of_items"
                  value={selectedEvent.names_of_items}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_guests"
                  value={selectedEvent.number_of_guests}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Other Counter Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="other_counter_price"
                  value={selectedEvent.other_counter_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Cleaning Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cleaning_price"
                  value={selectedEvent.cleaning_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Ice Cream Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="ice_cream_price"
                  value={selectedEvent.ice_cream_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Staff Number</Form.Label>
                <Form.Control
                  type="number"
                  name="staff_number"
                  value={selectedEvent.staff_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CoffeeShopEventList;
