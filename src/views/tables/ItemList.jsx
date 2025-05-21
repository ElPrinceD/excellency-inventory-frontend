import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CompanyItemList = () => {
  const [companies, setCompanies] = useState([]);
  const [allItems, setAllItems] = useState([]);   // all items fetched once
  const [filteredItems, setFilteredItems] = useState([]); // items shown for selected company
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchCompanies();
    fetchAllItems();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get('https://excellencycatering.com/api/company/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchAllItems = async () => {
    try {
      const { data } = await axios.get('https://excellencycatering.com/api/items/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    // Filter items for this company locally
    const itemsForCompany = allItems.filter(item => item.company === company.id);
    setFilteredItems(itemsForCompany);

    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setFilteredItems([]);
    setSelectedItem(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedItem = { ...selectedItem };

    updatedItem[name] = value;

    if (name === 'price_per_kg' || name === 'weight') {
      const price = parseFloat(updatedItem.price_per_kg) || 0;
      const weight = parseFloat(updatedItem.weight) || 0;
      updatedItem.total = (price * weight).toFixed(2);
    }

    setSelectedItem(updatedItem);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        date: selectedItem.date,
        item_id: selectedItem.item_id,
        name: selectedItem.name,
        price_per_kg: parseFloat(selectedItem.price_per_kg),
        weight: parseFloat(selectedItem.weight),
        total: parseFloat(selectedItem.total),
        company: selectedCompany.id,
      };

      await axios.patch(`https://excellencycatering.com/api/items/${selectedItem.id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Item updated successfully!');
      setErrorMessage('');

      // Update local allItems and filteredItems state after update
      const updatedAllItems = allItems.map(item => 
        item.id === selectedItem.id ? { ...item, ...payload } : item
      );
      setAllItems(updatedAllItems);

      const updatedFilteredItems = updatedAllItems.filter(item => item.company === selectedCompany.id);
      setFilteredItems(updatedFilteredItems);

      setShowModal(false);
    } catch (error) {
      console.error('Failed to update item:', error);
      setErrorMessage('Failed to update item.');
    }
  };

  return (
    <div>
      <h3 className="mb-4">
        {selectedCompany ? `Items for ${selectedCompany.name}` : 'Companies'}
      </h3>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}

      {!selectedCompany ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleCompanyClick(company)}>
                    View Items
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <>
          <Button variant="secondary" className="mb-3" onClick={handleBackToCompanies}>
            &larr; Back to Companies
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item ID</th>
                <th>Name</th>
                <th>Price per Kg</th>
                <th>Weight</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.item_id}</td>
                    <td>{item.name}</td>
                    <td>{item.price_per_kg}</td>
                    <td>{item.weight}</td>
                    <td>{item.total}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEditClick(item)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No items found for this company.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={selectedItem.date || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Item ID</Form.Label>
                <Form.Control
                  type="text"
                  name="item_id"
                  value={selectedItem.item_id || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedItem.name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price per Kg</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price_per_kg"
                  value={selectedItem.price_per_kg || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="weight"
                  value={selectedItem.weight || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Total</Form.Label>
                <Form.Control type="text" value={selectedItem.total || ''} readOnly />
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
    </div>
  );
};

export default CompanyItemList;
