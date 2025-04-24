import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';

const CoffeeShopEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    setError('You must be logged in to view events.');
    return;
  }

  useEffect(() => {
    const fetchEvents = async () => {
        try {
          const response = await axios.get('https://excellencycatering.com/api/coffeshop/', {
            headers: {
              'Authorization': `Bearer ${token}`,
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
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
                  <th>Other Counter Price</th>
                  <th>Cleaning Price</th>
                  <th>Ice Cream Price</th>
                  <th>Staff</th>
                  <th>Total Cost</th>
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
                      <th scope="row">{index + 1}</th>
                      <td>{event.date}</td>
                      <td>{event.names_of_items || 'N/A'}</td>
                      <td>{event.number_of_guests}</td>
                      <td>£{event.other_counter_price}</td>
                      <td>£{event.cleaning_price}</td>
                      <td>£{event.ice_cream_price}</td>
                      <td>{event.staff_number}</td>
                      <td>£{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CoffeeShopEventList;
