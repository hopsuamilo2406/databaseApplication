// src/CRUDPage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../API/utils';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Input, List, Row, Typography, notification} from 'antd';
import TextArea from 'antd/es/input/TextArea';

const API_URL = `${API_BASE_URL}/categories`

const Categories = () => {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      navigate('/');
    }
    fetchAll();
  }, []);
  
  const handleEditClick = (item) => {
    setEditFormData(item);
    setSelectedCategory(item);
    console.log(item);
    form.resetFields();
    form.setFieldValue('name', item.name);
    form.setFieldValue('parent_id', item.parent_id);
    form.setFieldValue('additional_attributes', JSON.stringify(item.additional_attributes));


  };

  const handleCancelEdit = () => {
    setEditFormData(null);
  };

  const handleEditSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');

    try {
      const submitData = {
        name: data.name,
        parent_id: data.parent_id,
        additional_attributes: JSON.parse(data.additional_attributes)
      }
      await axios.put(`${API_URL}/${editFormData._id}`, submitData, {
        headers: { 'x-access-token': `${token}` }
      });
      setEditFormData(null);
      notification.success({
        message: `Category ${editFormData.name} has been updated`,
      });
      await fetchAll();
    } catch (error) {
      error.response.data.message && notification.error({
        message: `Error updating category ${editFormData.name}: ` + error.response.data.message,
      });
      console.log(error.message)
    }
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
      const response = await axios.get(API_URL, {
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
      await fetchAll();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const onSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const submitData = {
        name: data.name,
        parent_id: data.parent_id,
        additional_attributes: JSON.parse(data.additional_attributes)
      }
      console.log(submitData)
      await axios.post(API_URL, submitData, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: `Category ${data.name} has been added`,
      });
      await fetchAll();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  return (
    <Row>
      <Col span={12}>
        <Button onClick={() => navigate('/admin/warehouse')}>Go back warehouse</Button>
        <h1>Categories Page</h1>
        <List
    grid={{ gutter: 16, column: 1 }}
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <p>categoryId: {item._id}</p>
              <p>name: {item.name}</p> 
              <p>parent_id: {item?.parent_id}</p>
              {item?.additional_attributes && Object.keys(item?.additional_attributes).map(function (key) { 
    return <p key={key}>{key}: {item?.additional_attributes[key]}</p>
})}

              <Button onClick={() => handleDelete(item._id)}>Delete</Button>
              <Button onClick={() => handleEditClick(item)}>Edit</Button>
      </List.Item>
    )}
  />
      </Col>
      <Col span={12}>
      {editFormData ?<EditForm form={form} handleEditSubmit={handleEditSubmit} selectedCategory={selectedCategory} handleCancelEdit={handleCancelEdit} ></EditForm>:<div>
          <h2>Add New Categories</h2>
          <Form onFinish={onSubmit} >
            <Form.Item label="Name" name="name" rules={[
              {
                required: true,
                message: 'Please input category name!',
              },
            ]}>
              <Input  />
            </Form.Item>
            <Form.Item label="parent ID" name="parent_id">
              <Input  />
            </Form.Item>
            <Form.Item label="Additional Attributes" name="additional_attributes">
              <TextArea placeholder="{ 'color' : 12321 }" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </div> }
      </Col>
    </Row>
  );
};

const EditForm = ({form, handleEditSubmit, data, selectedCategory, handleCancelEdit }) => {
  return (
    <>
    <Typography.Title level={3}>Edit Categories</Typography.Title>
    <Form
      form={form}
      onFinish={handleEditSubmit}
    >
    <Form.Item label="Name" name="name">
    <Input />
  </Form.Item>
  <Form.Item label="parent ID" name="parent_id">
              <Input  />
            </Form.Item>
  <Form.Item label="Additional Attributes" name="additional_attributes">
    <TextArea placeholder="{ 'color' : 12321 }" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">Submit</Button>
  </Form.Item>
  <Button onClick={handleCancelEdit}>Cancel</Button>

  </Form>
    </>
    
  );
}


export default Categories;
