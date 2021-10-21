import React from "react";
import { Form, Input, Radio } from "antd";

import { FormItem, FlexContainer } from "./style";

export default function AddressContainer({ change, state = {} }) {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const { pincode = "", city = "", name = "", addressLine2 = "" } = state;
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
        <FormItem name="addressLine2" label="Address Line 2" rules={[{ required: true }]}>
          <Input name="addressLine2" onChange={change} value={addressLine2} />
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
          <Radio.Group>
            <Radio.Button value="a">Home</Radio.Button>
            <Radio.Button value="b">Work</Radio.Button>
            <Radio.Button value="c">Other</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
}
