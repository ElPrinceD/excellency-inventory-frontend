import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import axios from 'axios';

const FormsElements = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('Select Supplier');
  const [quantityType, setQuantityType] = useState('UN'); // Default to 'Units' (backend value)
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Supplier and unit options from the backend
  const supplierOptions = [
    { value: 'N/A', label: 'N/A' },
    { value: 'Giro', label: 'Giro' },
    { value: 'Bid Food', label: 'Bid Food' },
    
   
  ];

  const quantityTypes = [
    { value: 'KG', label: 'Kilogram' },
    { value: 'BT', label: 'Bottles' },
    { value: 'UN', label: 'Units' },
    { value: 'G', label: 'Grams' },
    { value: 'L', label: 'Litres' },
    { value: 'CS', label: 'Case' },

  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!itemName || selectedSupplier === 'Select Supplier' || !quantity) {
      setError('All fields are required.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You must be logged in to add an item.');
      return;
    }

    
    try {
      console.log(token)
      const response = await axios.post(
        'https://excellencycatering.com/api/stocks/',
        {
          item_name: itemName,
          supplier_name: selectedSupplier,
          total_quantity: parseInt(quantity, 10),
          unit: quantityType,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Item added successfully!');
      // Reset form
      setItemName('');
      setSelectedSupplier('Select Supplier');
      setQuantity('');
      setQuantityType('UN');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add item. Please try again.');
    }
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleQuantityTypeSelect = (type) => {
    setQuantityType(type);
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Add Item</Card.Title>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Row>
                <Col md={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formItemName">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBrandName">
                      <Form.Label>Supplier Name</Form.Label>
                      <DropdownButton
                        variant="outline-secondary"
                        title={selectedSupplier === 'Select Supplier' ? 'Select Supplier' : supplierOptions.find(opt => opt.value === selectedSupplier)?.label}
                        id="supplier-dropdown"
                      >
                        {supplierOptions.map((supplier) => (
                          <Dropdown.Item
                            key={supplier.value}
                            onClick={() => handleSupplierSelect(supplier.value)}
                          >
                            {supplier.label}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formQuantity">
                      <Form.Label>Quantity</Form.Label>
                      <InputGroup>
                        <DropdownButton
                          variant="outline-secondary"
                          title={quantityTypes.find(opt => opt.value === quantityType)?.label}
                          id="quantity-type-dropdown"
                        >
                          {quantityTypes.map((type) => (
                            <Dropdown.Item
                              key={type.value}
                              onClick={() => handleQuantityTypeSelect(type.value)}
                            >
                              {type.label}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                        <Form.Control
                          type="decimal"
                          placeholder="Enter Quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="0"
                        />
                      </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsElements;