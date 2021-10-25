import React, { useState } from 'react';
import { Card, Radio } from 'antd';
// import styled from "styled-components";
export default function index({ address, addressList, selectedAddress, type }) {
  //   const [addressList, setAddressList] = useState(
  console.log({ address }, { selectedAddress });
  const addresstype = {
    shipping: 'selectedAddress',
    billing: 'billingAddress',
  };
  console.log({ address, addressList, selectedAddress, type });
  return (
    <>
      <div className="row main">
        <Radio.Group
          onChange={(e) => selectedAddress({ [`${addresstype[type]}`]: e.target.value })}
          style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}
          value={address}
        >
          <div className="cards-container">
            {addressList &&
              addressList.map((el) => (
                <>
                  <Card className="radio-wrapper">
                    <Radio value={el.type}>
                      <div className="mb-2">
                        {/* <Radio> */}
                        {el.type}
                        {/* </Radio> */}
                      </div>
                      <div>{el.addressLine}</div>
                      {/* <div>{el.addressLine2}</div> */}
                      <span>
                        {el.state}:{el.pincode}
                      </span>
                    </Radio>
                  </Card>
                </>
              ))}
          </div>
        </Radio.Group>
        {/* <div className="col-12 col-sm-6 mb-3  cards-container">
          <Card style={{ width: 300 }}>
            <div className="mb-2">
              <Radio>Home</Radio>
            </div>
            <div>
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
            </div>
          </Card>
        </div>*/}
      </div>
    </>
  );
}
