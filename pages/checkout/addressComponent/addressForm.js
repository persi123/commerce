import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, AutoComplete } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
// import { FormItem, FlexContainer } from './style';

const FormItem = styled(Form.Item)`
  .ant-form-item {
    display: block;
  }
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .ant-form-item-label {
    text-align: start;
    color: #292a2c;
    font-weight: bold;
  }
  .ant-input {
    border-radius: 8px;
  }
  .ant-select-show-search .ant-select-selector {
    height: 49px !important;
    padding-left: 0px !important;
    padding: 0 !important;
    border-radius: 8px !important;
  }
  .ant-select-single .ant-select-selector .ant-select-selection-search {
    top: 0 !important;
    right: 0px !important;
    bottom: 0 !important;
    left: 0px !important;
    border-radius: 8px !important;
  }
  .ant-select:hover,
  .ant-select:active,
  .ant-select:focus {
    border: 1px solid #d9d9d9;
  }
  .ant-select-selection-search-input {
    width: 272px;
    border: none !important;
  }
  .ant-select-selection-search-input:hover,
  .ant-select-selection-search-input:hover {
    border: none !important;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function AddressContainer({ change, state = {} }) {
  const [form] = Form.useForm();
  const { Option } = AutoComplete;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [result, setResult] = useState([]);

  const [Type, setType] = useState(false);
  let {
    pincode = '',
    city = '',
    name = '',
    addressLine1 = '',
    addressLine2 = '',
    type = '',
  } = state;

  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
  });
  const [codee, setcode] = useState('kk');

  const handleSearch = async (value) => {
    let res = [];
    res = await axios.get(`https://locationmmp.herokuapp.com/?city=${value}&region=ind`);
    // console.log(res);
    // if (!value || value.indexOf("@") >= 0) {
    //   res = [];
    // } else {
    res = res?.data?.data?.suggestedLocations?.map((el) => `${el.placeAddress}`);
    // }
    console.log(res);
    setResult(res);
  };

  const handleFormInputs = () => {
    let suggestion = '';
    // const items = result.length && result.includes(",")?result.split(","):result;
    if (result.length && result[result.length - 1].includes(',')) {
      suggestion = result[result.length - 1].split(',');
    } else {
      suggestion = result[result.length - 1];
    }
    // pincode = items[items.length - 1];
    form.city = suggestion[suggestion.length - 1];
    // console.log({ pincode }, { state });
    console.log(suggestion[suggestion.length - 1], { city });
    form.setFieldsValue({
      pincode: suggestion[suggestion.length - 1],
      city: suggestion[suggestion.length - 3],
      state: suggestion[suggestion.length - 2],
    });
    setFormData({ ...formData, city: suggestion[suggestion.length - 1] });
    setcode(suggestion[suggestion.length - 1]);
  };

  useEffect(() => {
    console.log(formData.city);
  }, [formData]);

  const handleChange = () => {};
  console.log({ result });
  return (
    <div style={{ width: '100%' }}>
      <Form
        // {...layout}
        form={form}
        id="address"
        name="nest-messages"
        // onFinish={() => submit()}
        // validateMessages={validateMessages}
      >
        <FormItem name="name" label="Name" rules={[{ required: true }]}>
          <Input name="name" onChange={change} value={name} />
        </FormItem>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormItem
            name="addressLine"
            label="Door / Apartment /  Floor no"
            rules={[{ required: true }]}
            style={{ width: '400px' }}
          >
            <Input name="addressLine1" onChange={change} value={addressLine1} />
          </FormItem>
          <FormItem style={{ display: 'flex', alignItems: 'center' }}>
            <AutoComplete
              style={{ width: 273, top: '18px' }}
              onSearch={handleSearch}
              // placeholder="input here"
              onSelect={handleFormInputs}
              defaultActiveFirstOption={false}
            >
              {result?.map((email, index) => (
                <Option key={index} value={email} onChange={() => console.log(email)}>
                  {email}
                </Option>
              ))}
            </AutoComplete>
          </FormItem>
          {/* <Input name="addressLine2" onChange={change} value={addressLine2} /> */}
        </div>
        {/* <FormItem name="addressLine" label="Address Line " rules={[{ required: true }]}>
          <Input name="addressLine" onChange={change} value={addressLine2} />
        </FormItem> */}
        <FlexContainer>
          <FormItem name="pincode" label="Pincode" rules={[{ required: true }]}>
            <Input name="pincode" onChange={change} value={codee} />
          </FormItem>
          <FormItem name="city" label="City" rules={[{ required: true }]}>
            <Input name="city" onChange={handleChange} value={formData.city} />
          </FormItem>
          <FormItem name="state" label="State" rules={[{ required: true }]}>
            <Input name="state" onChange={change} value={state} />
          </FormItem>
        </FlexContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            name="type"
            // label="Radio.Button"
            className="address-type"
            rules={[
              {
                required: true,
                message: 'Please pick an item!',
              },
            ]}
          >
            <Radio.Group
              name="type"
              onChange={(e) => {
                e.target.value === 'other' ? setType(true) : setType(false);
                console.log(e.target);
                change(e);
              }}

              // onChange={change}
            >
              <Radio.Button value="home">Home</Radio.Button>
              <Radio.Button value="work">Work</Radio.Button>
              <Radio.Button value="other">Other</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {!!Type && (
            <Form.Item>
              <Input
                style={{ borderRadius: '8px' }}
                name="type"
                // onChange={change}
                value={type === 'other' ? '' : type}
              />
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
}
