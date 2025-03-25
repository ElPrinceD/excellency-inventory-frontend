import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BootstrapTable = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchStocks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to view stock data.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://excellencycatering.com/api/stocks/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // For each stock, fetch today's transactions
        const stocksWithTransactions = await Promise.all(
          response.data.map(async (stock) => {
            const transResponse = await axios.get(
              `https://excellencycatering.com/api/stocks/${stock.id}/transactions/`,
              {
                headers: { 'Authorization': `Bearer ${token}` },
              }
            );

            // Calculate today's in/out
            const today = new Date().toISOString().split('T')[0];
            const todayTransactions = transResponse.data.filter((trans) =>
              trans.timestamp.startsWith(today)
            );
            const inToday = todayTransactions
              .filter((t) => t.transaction_type === 'IN')
              .reduce((sum, t) => sum + t.quantity, 0);
            const outToday = todayTransactions
              .filter((t) => t.transaction_type === 'OUT')
              .reduce((sum, t) => sum + t.quantity, 0);

            // Calculate total in stock considering today's transactions
            const totalInStock = stock.total_quantity + inToday - outToday;

            return { ...stock, inToday, outToday, totalInStock };
          })
        );

        setStocks(stocksWithTransactions);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Filter and sort stocks based on search query and item_name
  const filteredStocks = stocks
    .filter(stock =>
      stock.item_name.toLowerCase().includes(searchQuery) ||
      stock.supplier_name.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => a.item_name.localeCompare(b.item_name)); // Alphabetical sort by item_name

  const clickableStyle = {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (stocks.length === 0) {
    return (
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">All Item Lists</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>No Stock</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">All Item Lists</Card.Title>
              <span className="d-block m-t-5">
                This is a list of all items {searchQuery && `(Searching: ${searchQuery})`}
              </span>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Supplier Name</th>
                    <th>Last Updated</th>
                    <th>Quantity</th>
                    <th>In/Out Today</th>
                    <th>Total In Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <tr key={stock.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <Link to={`/item/${stock.id}`} style={clickableStyle}>
                          {stock.item_name}
                        </Link>
                      </td>
                      <td>{stock.supplier_name}</td>
                      <td>{new Date(stock.last_updated).toLocaleDateString()}</td>
                      <td>{`${stock.total_quantity} ${stock.unit}`}</td>
                      <td>
                        <span style={{ color: 'green' }}>In: {stock.inToday || 0}</span> /
                        <span style={{ color: 'red' }}> Out: {stock.outToday || 0}</span>
                      </td>
                      <td>{`${stock.totalInStock} ${stock.unit}`}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;