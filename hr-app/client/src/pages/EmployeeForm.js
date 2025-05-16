import React, { useState } from 'react';
import { Card, Form, Input, Row, Col, Select, DatePicker, InputNumber, Button, Steps, Step } from 'antd';

const ReviewStep = ({ form, onEdit, onSubmit }) => {
  const formData = form.getFieldsValue();
  
  const renderField = (label, value) => (
    <div style={{ marginBottom: '8px' }}>
      <strong>{label}:</strong> {value || '-'}
    </div>
  );

  const renderSection = (title, fields) => (
    <Card title={title} style={{ marginBottom: '24px' }}>
      {fields.map(({ label, name, type = 'text' }) => {
        let value = formData[name];
        if (type === 'date' && value) {
          value = value.format('YYYY-MM-DD');
        }
        return renderField(label, value);
      })}
      <Button type="link" onClick={() => onEdit(title)}>Edit</Button>
    </Card>
  );

  return (
    <div>
      <h2>Review Employee Details</h2>
      <p>Please review all the information before submitting. You can edit any section by clicking the "Edit" button.</p>
      
      {renderSection('Personal Information', [
        { label: 'Joining Reference ID', name: 'joining_reference_id' },
        { label: 'Prefix', name: 'prefix' },
        { label: 'First Name', name: 'first_name' },
        { label: 'Middle Name', name: 'middle_name' },
        { label: 'Last Name', name: 'last_name' },
        { label: "Father's Name", name: 'fathers_name' },
        { label: "Mother's Name", name: 'mothers_name' },
        { label: 'Date of Birth', name: 'dob', type: 'date' },
        { label: 'Gender', name: 'gender' },
        { label: 'Marital Status', name: 'marital_status' },
        { label: 'Blood Group', name: 'blood_group' },
        { label: 'Nationality', name: 'nationality' },
        { label: 'Birth State', name: 'birth_state' },
        { label: 'Birth Location', name: 'birth_location' },
        { label: 'Religion', name: 'religion' },
        { label: 'Caste', name: 'caste' },
        { label: 'Qualification', name: 'qualification' },
        { label: 'Permanent Address', name: 'permanent_address' },
        { label: 'Quarter Number', name: 'quarter_no' },
        { label: 'Mobile Number', name: 'mobile_no' },
        { label: 'Official Email', name: 'official_email' },
        { label: 'Personal Email', name: 'personal_email' },
        { label: 'PAN Number', name: 'pan_no' },
        { label: 'Aadhar Number', name: 'aadhar_no' },
        { label: 'Bank Name', name: 'bank_name' },
        { label: 'Bank Account Number', name: 'bank_account_no' },
        { label: 'IFSC Code', name: 'ifsc_code' }
      ])}

      {renderSection('Professional Details', [
        { label: 'Department', name: ['professionalDetails', 'department'] },
        { label: 'Designation', name: ['professionalDetails', 'designation'] },
        { label: 'Job Band', name: ['professionalDetails', 'job_band'] },
        { label: 'Date of Joining Unit', name: ['professionalDetails', 'doj_unit'], type: 'date' },
        { label: 'Date of Joining Group', name: ['professionalDetails', 'doj_group'], type: 'date' },
        { label: 'LOI Issue Date', name: ['professionalDetails', 'loi_issue_date'], type: 'date' },
        { label: 'Confirmation Date', name: ['professionalDetails', 'confirmation_date'], type: 'date' },
        { label: 'Current CTC', name: ['professionalDetails', 'current_ctc'] },
        { label: 'Supervisor Name', name: ['professionalDetails', 'supervisor_name'] }
      ])}

      {renderSection('GPA Nominee', [
        { label: 'Nominee Name', name: ['gpa_nominee', 'name'] },
        { label: 'Relation', name: ['gpa_nominee', 'relation'] },
        { label: 'Date of Birth', name: ['gpa_nominee', 'dob'], type: 'date' },
        { label: 'Age', name: ['gpa_nominee', 'age'] },
        { label: 'Contribution %', name: ['gpa_nominee', 'contribution_percent'] }
      ])}

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit Employee Details
        </Button>
      </div>
    </div>
  );
};

const EmployeeForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const handleNext = () => {
    if (currentStep === 2) { // If on last step
      setShowReview(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleEdit = (section) => {
    setShowReview(false);
    // Set the current step based on the section being edited
    switch (section) {
      case 'Personal Information':
        setCurrentStep(0);
        break;
      case 'Professional Details':
        setCurrentStep(1);
        break;
      case 'GPA Nominee':
        setCurrentStep(2);
        break;
      default:
        setCurrentStep(0);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Your existing submit logic here
      console.log('Form submitted:', values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (showReview) {
    return (
      <div style={{ padding: '24px' }}>
        <ReviewStep 
          form={form}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Steps current={currentStep} style={{ marginBottom: '24px' }}>
        <Step title="Personal Information" />
        <Step title="Professional Details" />
        <Step title="GPA Nominee" />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* 3. GPA Nominee */}
        <Card title="3. GPA Nominee" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={['gpa_nominee', 'name']}
                label="Nominee Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['gpa_nominee', 'relation']}
                label="Relation"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['gpa_nominee', 'dob']}
                label="Date of Birth"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['gpa_nominee', 'age']}
                label="Age"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['gpa_nominee', 'contribution_percent']}
                label="Contribution %"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 1. Personal Information */}
        <Card title="1. Personal Information" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="joining_reference_id"
                label="Joining Reference ID"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="prefix"
                label="Prefix"
              >
                <Select>
                  <Option value="Mr.">Mr.</Option>
                  <Option value="Mrs.">Mrs.</Option>
                  <Option value="Ms.">Ms.</Option>
                  <Option value="Dr.">Dr.</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="middle_name"
                label="Middle Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="fathers_name"
                label="Father's Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="mothers_name"
                label="Mother's Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="marital_status"
                label="Marital Status"
              >
                <Select>
                  <Option value="Single">Single</Option>
                  <Option value="Married">Married</Option>
                  <Option value="Divorced">Divorced</Option>
                  <Option value="Widowed">Widowed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="blood_group"
                label="Blood Group"
              >
                <Select>
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="nationality"
                label="Nationality"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="birth_state"
                label="Birth State"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="birth_location"
                label="Birth Location"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="religion"
                label="Religion"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="caste"
                label="Caste"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="qualification"
                label="Qualification"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="permanent_address"
            label="Permanent Address"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quarter_no"
                label="Quarter Number"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mobile_no"
                label="Mobile Number"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="official_email"
                label="Official Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="personal_email"
                label="Personal Email"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pan_no"
                label="PAN Number"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="aadhar_no"
                label="Aadhar Number"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bank_name"
                label="Bank Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bank_account_no"
                label="Bank Account Number"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ifsc_code"
                label="IFSC Code"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: '8px' }} onClick={handleBack}>
              Back
            </Button>
          )}
          <Button type="primary" onClick={handleNext}>
            {currentStep === 2 ? 'Review' : 'Next'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeForm; 