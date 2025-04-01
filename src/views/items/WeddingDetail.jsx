import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
          .wedding-title {
            font-size: 1.5rem; /* Enlarged title font */
            text-align: center;
            margin-bottom: 1rem;
          }
          .category-title {
            font-size: 1.25rem; /* Enlarged category titles */
            font-weight: bold;
            text-align: center;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .category-content {
            font-size: 1.1rem; /* Enlarged content font */
            text-align: center;
          }
          .dish-item {
            margin-bottom: 0.25rem; /* Spacing between dishes */
          }
        `}
      </style>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5" className="wedding-title">
                {wedding.name}'s Wedding
              </Card.Title>
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
              <Card.Text className="category-title">Date</Card.Text>
              <div className="category-content">
                <strong>{new Date(wedding.date).toLocaleDateString()}</strong>
              </div>

              <Card.Text className="category-title">Time</Card.Text>
              <div className="category-content">
                <strong>{wedding.time}</strong>
              </div>

              <Card.Text className="category-title">Hall</Card.Text>
              <div className="category-content">{wedding.hall.name}</div>

              <Card.Text className="category-title">Number of Guests</Card.Text>
              <div className="category-content">
                <strong>{wedding.number_of_guests}</strong>
              </div>

              {['salad', 'starter', 'rice', 'curry', 'main_course', 'sauce', 'dessert', 'drink'].map((category) => {
                const dishes = getDishesByType(wedding.dishes, category);
                return dishes.length > 0 ? (
                  <div key={category}>
                    <Card.Text className="category-title">
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </Card.Text>
                    <div className="category-content">
                      {dishes.map((dish, index) => (
                        <div key={index} className="dish-item">{dish}</div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}

              <Card.Text className="category-title">Additional Info</Card.Text>
              <div className="category-content">{wedding.additional_info || 'None'}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WeddingDetail;