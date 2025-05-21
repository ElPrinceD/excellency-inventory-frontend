import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WeddingList = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchWeddings = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to view wedding data.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://excellencycatering.com/api/weddings/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setWeddings(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load wedding data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  // Sort weddings by date ascending (older to newer)
  const sortedWeddings = [...weddings].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter weddings based on search query
  const filteredWeddings = sortedWeddings.filter((wedding) => {
    const searchString = `${wedding.name} ${wedding.date} ${wedding.time} ${wedding.hall.name} ${wedding.number_of_guests} ${wedding.additional_info || ''}`.toLowerCase();
    return searchString.includes(searchQuery);
  });

  const handleRowClick = (weddingId) => {
    navigate(`/weddings/${weddingId}`);
  };

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
            <Card.Title as="h5">Wedding List</Card.Title>
            <span className="d-block m-t-5">
              {searchQuery && `Searching: ${searchQuery}`}
            </span>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Hall</th>
                  <th>Guests</th>
                </tr>
              </thead>
              <tbody>
                {filteredWeddings.map((wedding, index) => (
                  <tr
                    key={wedding.id}
                    onClick={() => handleRowClick(wedding.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{wedding.name}</td>
                    <td>{new Date(wedding.date).toLocaleDateString()}</td>
                    <td>{wedding.time}</td>
                    <td>{wedding.hall.name}</td>
                    <td>{wedding.number_of_guests}</td>
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

export default WeddingList;
