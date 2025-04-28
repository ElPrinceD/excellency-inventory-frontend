import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchItems();
    fetchCompanies();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://excellencycatering.com/api/items/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('https://excellencycatering.com/api/company/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    let updatedPurchase = {
      ...selectedPurchase,
      [name]: name === 'price_per_kg' || name === 'weight' ? parseFloat(value) : value,
    };

    if (name === 'company') {
      const selectedCompany = companies.find((c) => c.id === parseInt(value));
      updatedPurchase.company = selectedCompany;
    }

    if (name === 'price_per_kg' || name === 'weight') {
      const price = parseFloat(updatedPurchase.price_per_kg || 0);
      const weight = parseFloat(updatedPurchase.weight || 0);
      updatedPurchase.total = (price * weight).toFixed(2);
    }

    setSelectedPurchase(updatedPurchase);
  };

  const handleUpdatePurchase = async () => {
    try {
      await axios.put(
        `https://excellencycatering.com/api/items/${selectedPurchase.id}/`,
        {
          ...selectedPurchase,
          company: selectedPurchase.company?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccessMessage('Purchase updated successfully!');
      setErrorMessage('');
      fetchItems();
      setShowEditModal(false);
    } catch (error) {
      setErrorMessage('Failed to update purchase.');
      console.error(error);
    }
  };

  return (
    <div>
      <h3 className="mb-4">Item Purchases</h3>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item ID</th>
            <th>Name</th>
            <th>Company</th>
            <th>Price per Kg</th>
            <th>Weight</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.date}</td>
              <td>{purchase.item_id}</td>
              <td>{purchase.name}</td>
              <td>{purchase.company?.name}</td>
              <td>{purchase.price_per_kg}</td>
              <td>{purchase.weight}</td>
              <td>{purchase.total}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditClick(purchase)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPurchase && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={selectedPurchase.date}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Item ID</Form.Label>
                <Form.Control
                  type="text"
                  name="item_id"
                  value={selectedPurchase.item_id}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedPurchase.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Company</Form.Label>
                <Form.Select
                  name="company"
                  value={selectedPurchase.company?.id || ''}
                  onChange={handleEditChange}
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price per Kg</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price_per_kg"
                  value={selectedPurchase.price_per_kg}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="weight"
                  value={selectedPurchase.weight}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPurchase.total}
                  readOnly
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePurchase}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemList;
