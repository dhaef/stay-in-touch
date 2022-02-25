import React from 'react';
import { Upload, Collapse } from 'antd';
import axios from 'axios';
import Card from '../style/card';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FieldItem = styled.div`
  background-color: #fafafa;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

const FieldRow = styled.div`
  margin: 5px;
`;

const FieldLabel = styled.span`
  font-weight: 700;
`;

const data = [
  {
    field_name: 'name',
    required: true,
    description: 'Name of the contact',
  },
  {
    field_name: 'contact info',
    required: false,
    description: 'Name of the contact',
  },
  {
    field_name: 'notes',
    required: false,
    description: 'Notes on the contact',
  },
  {
    field_name: 'frequency',
    required: true,
    description: 'Number of frequency types until next reminder',
  },
  {
    field_name: 'frequency type',
    required: true,
    description: 'Time type (ie. days) until next reminder',
  },
];

const BulkAddContacts = ({ token, fetch }) => {
  const onChange = (info) => {
    // console.log(info.file);
  };

  const beforeUpload = (stuff) => {
    // console.log(stuff);
  };

  const customRequest = async (data) => {
    const { file, onSuccess, onError } = data;

    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post('/api/contacts/bulk', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetch();
      onSuccess(true);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Card title="Bulk Add Contacts">
      <p>Add multiple contacts at once by uploading a .csv file.</p>
      <p>
        <Link to="/stay-in-contact.csv" target="_blank" download>
          Download a template.
        </Link>
      </p>
      <Upload.Dragger
        name="file"
        maxCount={1}
        onChange={onChange}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        accept=".csv"
      >
        <p>Click or Drap & Drop your .csv file here</p>
      </Upload.Dragger>
      <Collapse style={{ marginTop: '20px' }}>
        <Collapse.Panel header="Field Descriptions">
          <div>
            {data.map((i, index) => (
              <FieldItem key={index}>
                <FieldRow>
                  <FieldLabel>
                    Field Name {i.required ? '[Required]' : null}:{' '}
                  </FieldLabel>
                  {i.field_name}
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Description: </FieldLabel>
                  {i.description}
                </FieldRow>
              </FieldItem>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
};

export default BulkAddContacts;