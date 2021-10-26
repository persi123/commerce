import React, { useState } from "react";
import { Form, Input, Radio } from "antd";
import styled from "styled-components";
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
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function AddressContainer({ change, state = {} }) {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [Type, setType] = useState(false);
  const { pincode = "", city = "", name = "", addressLine2 = "", type = "" } = state;
  return (
    <div style={{ width: "100%" }}>
      <Form
        // {...layout}
        id="address"
        name="nest-messages"
        // onFinish={() => submit()}
        // validateMessages={validateMessages}
      >
        <FormItem name="name" label="Name" rules={[{ required: true }]}>
          <Input name="name" onChange={change} value={name} />
        </FormItem>
        <FormItem name="addressLine" label="Address Line " rules={[{ required: true }]}>
          <Input name="addressLine" onChange={change} value={addressLine2} />
        </FormItem>
        <FlexContainer>
          <FormItem name="pincode" label="Pincode" rules={[{ required: true }]}>
            <Input name="pincode" onChange={change} value={pincode} />
          </FormItem>
          <FormItem name="city" label="City" rules={[{ required: true }]}>
            <Input name="city" onChange={change} value={city} />
          </FormItem>
          <FormItem name="state" label="State" rules={[{ required: true }]}>
            <Input name="state" onChange={change} value={state} />
          </FormItem>
        </FlexContainer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Item
            name="type"
            // label="Radio.Button"
            className="address-type"
            rules={[
              {
                required: true,
                message: "Please pick an item!",
              },
            ]}
          >
            <Radio.Group
              name="type"
              onChange={(e) => {
                e.target.value === "other" ? setType(true) : setType(false);
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
                style={{ borderRadius: "8px" }}
                name="type"
                onChange={change}
                value={type === "other" ? "" : type}
              />
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
}
