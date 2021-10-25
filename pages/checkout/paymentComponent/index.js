import React from "react";
import styled from "styled-components";
import { Tabs, Collapse } from "antd";
import Image from "next/image";
import discount from ".././discount.png";

const Tab = styled(Tabs)`
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
  .ant-tabs-tab-btn:focus,
  .ant-tabs-tab-remove:focus,
  .ant-tabs-tab-btn:active,
  .ant-tabs-tab-remove:active,
  .ant-tabs-tab:hover {
    color: #38446d;
  }
  .ant-tabs-ink-bar {
    left: 0;
  }
  .ant-tabs-ink-bar {
    background: #292a2c !important;
  }
  &:focus {
    outline: none;
  }
`;

const index = () => {
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  return (
    <>
      <div className="row">
        <div className="col-12  m-3">
          <p className="font-size-subheader font-weight-semibold ">Delivery Address</p>
          <p className="font-size-caption" style={{ opacity: "60%", maxWidth: "200px" }}>
            Under Secretary (Funds), PMO, South Block, New Delhi, Pin -110011
          </p>
          <p className="font-size-paragraph">(Home)</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12  m-3">
          <p className="font-size-subheader" style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "19px", height: "22px", marginRight: "5px" }}>
              <Image src={discount} />
            </div>
            <span> Available Offers</span>
          </p>
          <p className="font-size-caption" style={{ opacity: "60%" }}>
            10% cashback on above order of 100 valid only on amazon pay
          </p>
          <p className="font-size-paragraph" style={{ textDecoration: "underline" }}>
            <Collapse
              // activeKey={this.state.showOffers}
              className="collapse-container"
              accordion
            >
              <Panel header="Availabe Offers" key="cash">
                <div
                  style={{
                    // marginLeft: "24px",
                    lineHeight: "2.1",
                    fontWeight: "normal",
                  }}
                >
                  <ul style={{ lineHeight: "39px", fontSize: " 13px" }}>
                    <li>10% cashback on order above 100 vaild only for amazon pay</li>
                    <li>10% cashback on order above 100 vaild only for amazon pay</li>
                    <li>10% cashback on order above 100 vaild only for amazon pay</li>
                  </ul>
                </div>
              </Panel>
            </Collapse>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12  m-3">
          <p className="font-size-subheader font-weight-semibold ">Choose Payment Mode</p>
          {/* <Radio.Group>
                                  <Radio>Prepaid</Radio>
                                  <Radio>Cash</Radio>
                                </Radio.Group> */}
          <div>
            <Tab tabPosition="left">
              <TabPane tab="Credit / Debit Card" key="1">
                Content of Tab 1
              </TabPane>
              <TabPane tab="Net Banking" key="2">
                Content of Tab 2
              </TabPane>
              <TabPane tab="EMI" key="3">
                Content of Tab 3
              </TabPane>
              <TabPane tab="UPI" key="4">
                Content of Tab 3
              </TabPane>
              <TabPane tab="Wallets" key="5">
                Content of Tab 3
              </TabPane>
              <TabPane tab="Cash on Delivery" key="6">
                Content of Tab 3
              </TabPane>
            </Tab>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
