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

  const dishCategories = [
    'salad', 'starter', 'rice', 'curry', 'main_course', 'sauce', 'dessert', 'drink'
  ].map(category => ({
    title: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
    dishes: getDishesByType(wedding.dishes, category)
  })).filter(cat => cat.dishes.length > 0);

  return (
    <>
      <style>
        {`@media print {
  .no-print, nav, header, footer {
    display: none !important;
  }
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .wedding-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0.5in;
    box-sizing: border-box;
  }
  .card-header {
    border-bottom: none;
  }
  .card-body {
    padding: 0;
  }
  @page {
    size: A4;
    margin: 0;
  }
  .wedding-title {
    font-size: 16pt;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .info-line, .category-title, .dish-item, .additional-info-title, .additional-info-content {
    font-size: 12pt;
    margin-bottom: 0.3rem;
  }
  .two-column-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .column {
    width: 48%;
  }
}

.wedding-container {
  max-width: 1200px;
  margin: 0 auto;
}
.wedding-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0.75rem;
}
.info-line {
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
.category-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.5rem;
  text-decoration: underline;
}
.dish-item {
  font-size: 1.1rem;
  text-align: left;
  margin-bottom: 0.25rem;
}
.two-column-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.column {
  width: 48%;
}
.additional-info-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  text-decoration: underline;
}
.additional-info-content {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 0.25rem;
}
`}
      </style>
      <Row>
        <Col>
          <Card className="wedding-container">
            <Card.Header>
              <Card.Title as="h5" className="wedding-title">
                {wedding.name}'s Wedding
              </Card.Title>
              <div className="float-end no-print">
                <Button variant="primary" onClick={handlePrint} className="me-2">
                  Print
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/weddings/${id}/edit`)}>
  Edit Details
</Button>

              </div>
            </Card.Header>
            <Card.Body>
              <div className="info-line">
                <strong>Date:</strong> <strong>{new Date(wedding.date).toLocaleDateString()}</strong> {wedding.time}{' '}
                {wedding.hall.name} - <strong>Guests:</strong> <strong>{wedding.number_of_guests}</strong>
              </div>

              {/* Two-column layout for dish categories */}
              {Array.from({ length: Math.ceil(dishCategories.length / 2) }).map((_, index) => (
                <div key={index} className="two-column-row">
                  <div className="column">
                    {dishCategories[index * 2] && (
                      <>
                        <div className="category-title">{dishCategories[index * 2].title}</div>
                        {dishCategories[index * 2].dishes.map((dish, i) => (
                          <div key={i} className="dish-item">{dish}</div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="column">
                    {dishCategories[index * 2 + 1] && (
                      <>
                        <div className="category-title">{dishCategories[index * 2 + 1].title}</div>
                        {dishCategories[index * 2 + 1].dishes.map((dish, i) => (
                          <div key={i} className="dish-item">{dish}</div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Additional Info at the bottom, centered */}
              <div className="additional-info-title">Additional Info</div>
              <div className="additional-info-content">{wedding.additional_info || 'None'}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WeddingDetail;