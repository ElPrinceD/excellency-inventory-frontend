import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WeddingDetail = () => {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get wedding ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWedding = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to view wedding detail.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://excellencycatering.com/api/weddings/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setWedding(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load wedding details.');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  const getDishesByType = (dishes, type) => {
    return dishes
      .filter((dish) => dish.dish_type === type)
      .map((dish) => (dish.notes ? `${dish.name} (${dish.notes})` : dish.name));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!wedding) {
    return <div>Wedding not found.</div>;
  }

  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
            .card-header {
              border-bottom: none;
            }
            .card-body {
              padding-top: 0;
            }
          }
        `}
      </style>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{wedding.name}'s Wedding</Card.Title>
              <div className="float-end no-print">
                <Button variant="primary" onClick={handlePrint} className="me-2">
                  Print
                </Button>
                <Button variant="secondary" onClick={() => navigate('/weddings')}>
                  Back to List
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Date:</strong> <strong>{new Date(wedding.date).toLocaleDateString()}</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Time:</strong> <strong>{wedding.time}</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Hall:</strong> {wedding.hall.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Number of Guests:</strong> <strong>{wedding.number_of_guests}</strong>
                </ListGroup.Item>
                {['salad', 'starter', 'rice', 'curry', 'main_course', 'sauce', 'dessert', 'drink'].map((category) => {
                  const dishes = getDishesByType(wedding.dishes, category);
                  return dishes.length > 0 ? (
                    <ListGroup.Item key={category}>
                      <strong>{category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}:</strong>{' '}
                      {dishes.join(', ')}
                    </ListGroup.Item>
                  ) : null;
                })}
                <ListGroup.Item>
                  <strong>Additional Info:</strong> {wedding.additional_info || 'None'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WeddingDetail;