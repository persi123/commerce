import styled from "styled-components";
import { Card, Checkbox, Form, Radio, Tabs } from "antd";

export const FormItem = styled(Form.Item)`
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
export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const DeliveryCards = styled(Card)`
  border-radius: 12px !important;
  margin-bottom: 4px !important;
  background-color: ${({ selectedDeliverySpeed, value }) =>
    selectedDeliverySpeed === value ? "#EAEAEA" : "#fff"};
  .ant-radio-checked .ant-radio-inner {
    border-color: #000;
  }
  .ant-radio-inner::after {
    background-color: #000;
  }
`;

export const CustomRadio = styled(Radio)`
  span {
    width: 100%;
  }
  .ant-radio {
    width: 16px;
  }
`;

export const Tab = styled(Tabs)`
  /* padding: 13px 45px !important; */
  .ant-tabs-tab:nth-child(2),
  .ant-tabs-tab:nth-child(3),
  .ant-tabs-tab:nth-child(4),
  .ant-tabs-tab:nth-child(5),
  .ant-tabs-tab:nth-child(6) {
    margin-top: 0 !important;
    border-top: 1px solid #c5cde3 !important;
  }
  .ant-tabs-nav-wrap {
    border-radius: 10px;
    border: 1px solid #c5cde3;
  }
  .ant-tabs-tab-active {
    background-color: #eaeaea;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #38446d;
    font-size: 14px;
  }
  .ant-tabs-ink-bar {
    left: 0;
  }
  .ant-tabs-ink-bar {
    background: #292a2c !important;
  }
`;

export const CustomCheck = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #000;
    border-color: #000;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #000;
  }
`;
