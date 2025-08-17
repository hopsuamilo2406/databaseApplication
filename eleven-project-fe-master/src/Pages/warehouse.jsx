import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../API/utils';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Input, Row, Typography, notification } from 'antd';

const API_URL = `${API_BASE_URL}/warehouses`

const CRUDPage = () => {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if(role !== 'ADMIN') {
      navigate('/');
    }
    fetchAll();
  }, []);

  const handleCreate = async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(API_URL, data, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: 'Warehouse created successfully',
      });
      setIsCreateVisible(false);
      fetchAll();
    } catch (error) {
      notification.error({
        message: 'Warehouse creation failed',
      });
    }
  };
  
  const showCreateModal = () => {
    setIsCreateVisible(true);
  };

  const handleEdit = async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/${editData.id}`, data, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: 'Warehouse updated successfully',
      });
      setIsEditVisible(false);
      fetchAll();
    } catch (error) {
      notification.error({
        message: 'Warehouse update failed',
      });
    }
  };
  
  const showEditModal = (data) => {
    setEditData(data);
    setIsEditVisible(true);
  };
  

  const fetchAll = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(API_URL, {
        headers: { 'x-access-token': `${token}` }
      });
      console.log('Data fetched:', response.data)
      setData(response.data);
      await fetchAllProduct();

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAllProduct = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(`${API_BASE_URL}/products?size=100`, {
        headers: { 'x-access-token': `${token}` }
      });
      console.log('Data fetched:', response.data.products)
      setProductData(response.data.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: 'Warehouse deleted successfully',
      });

      await fetchAll(); // Refresh the list after deletion
    } catch (error) {
      error.response.data.message && notification.error({
        message: error.response.data.message,
      });
      console.error('Error deleting item:', error);
    }
  };

  const handleMove = async (data) => {
    const token = localStorage.getItem('accessToken');
    const body = 
      {
        productId: data.productId,
        warehouseId: data.warehouseId
      }
    try {
      await axios.post(`${API_BASE_URL}/products/move`, body, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: 'Move product successfully',
      });
      fetchAll(); // Refresh the list after deletion

    }
    catch (error) {
      console.error('Error move product:', error);
      notification.error({
        message: 'Move product failed',
      });
    }
  }
  return (
    <Row>
      <Col span={12}>
      <Button onClick={()=>navigate('/admin/categories')}> Go to cateogry management</Button>
      <h1>Warehouse Page</h1>
      {/* Existing content... */}
      <Button onClick={showCreateModal}>Create Warehouse</Button>
      {isCreateVisible && (
        <Form onFinish={handleCreate}>

          <Form.Item  name="name" label="Name:"  rules={[
              {
                required: true,
                message: 'Please input category name!',
              },
            ]}>
            <Input type="text" name="name" />
          </Form.Item>
          <Form.Item name="address" label="Address:">
            <Input type="text" name="address" />
          </Form.Item>
          <Form.Item name="volume" label="Volume:"  rules={[
              {
                required: true,
                message: 'Please input volume!',
              },
            ]}>
            <Input type="text" name="volume"/>
          </Form.Item>
          
          <Button onClick={() => setIsCreateVisible(false)}>Close</Button>
          <Form.Item>
              <Button type="primary" htmlType="submit">Create</Button>
            </Form.Item>
        </Form>
      )}

      {isEditVisible && (
       <Form onFinish={handleEdit}>
          <Form.Item name="name" label="Name:"  rules={[
              {
                required: true,
                message: 'Please input category name!',
              },
            ]}>
            <Input type="text" name="name" defaultValue={editData.name} />
          </Form.Item>
          <Form.Item name="address" label="Address:">
            <Input type="text" name="address" defaultValue={editData.address} />
          </Form.Item>
          <Form.Item name="volume" label="Volume:"  rules={[
              {
                required: true,
                message: 'Please input volume!',
              },
            ]}>
            <Input type="text" name="volume" defaultValue={editData.volume}/>
          </Form.Item>
          
          <Button onClick={() => setIsEditVisible(false)}>Close</Button>
          <Form.Item>
              <Button type="primary" htmlType="submit">Edit</Button>
            </Form.Item>
        </Form>
      )}

      <ul>
        {data.map(item => (
          <li key={item.id}>
            <p>warehouseId: {item.id}</p>
             <p>name: {item.name}</p> <p>address: {item.address}</p> <p>volume: {item.volume}</p> <button onClick={() => handleDelete(item.id)}>Delete</button> <button onClick={() => showEditModal(item)}>Edit</button>

            {/* product same warehouseid */}
            <ul>
              {productData && productData.map(product => (
                product.warehouseId === item.id ? <li key={product.id}>
                  <p>productId: {product.id}</p>
                  <p>title: {product.title}</p> <p>price: {product.price}</p> <p>quantity: {product.quantityNumber}</p>
                </li> : null
              ))}
            </ul>
          </li>
        ))}
      </ul>
      </Col>
        <Col span={12}> 
        <div>
        
        <Typography.Title level={3}>Move product</Typography.Title>
        <Form onFinish={handleMove}>
          <Form.Item name="productId" label="Product ID:">
            <Input />
          </Form.Item>
          <Form.Item name="warehouseId" label="Warehouse ID:">
            <Input/>
          </Form.Item>
          <Form.Item type="submit" value="Submit" >
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
                

      </div>
      </Col>
    </Row>
   
  );
};

export default CRUDPage;
