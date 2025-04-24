import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';

const ItemList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    setError('You must be logged in to add an item.');
    return;
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://excellencycatering.com/api/items/',{
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        setPurchases(response.data);
      } catch (err) {
        setError('Failed to load item purchases.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Item Purchases</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Price/kg</th>
                  <th>Weight (kg)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, index) => (
                  <tr key={p.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{p.date}</td>
                    <td>{p.item_id}</td>
                    <td>{p.name}</td>
                    <td>£{p.price_per_kg}</td>
                    <td>{p.weight}</td>
                    <td>£{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ItemList;