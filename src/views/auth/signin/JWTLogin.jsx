import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JWTLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('https://excellencycatering.com/api/users/login/', {
        username: values.username,
        password: values.password,
      });
      
      // Store the access token in localStorage
      const { access } = response.data;
      localStorage.setItem('accessToken', access);
  
      // Redirect to the Bootstrap table page
      navigate('/tables/bootstrap');
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('Username is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
              placeholder="Enter username"
            />
            {touched.username && errors.username && (
              <small className="text-danger form-text">{errors.username}</small>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              placeholder="Enter password"
            />
            {touched.password && errors.password && (
              <small className="text-danger form-text">{errors.password}</small>
            )}
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials
            </label>
          </div>

          {errors.submit && (
            <Col sm={12}>
              <Alert variant="danger">{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="primary"
              >
                Sign In
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;