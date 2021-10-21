import React, { useState } from 'react';
import { Card, Radio } from 'antd';
// import styled from "styled-components";
export default function index({ addressList, selectedAddress }) {
  //   const [addressList, setAddressList] = useState(
  return (
    <>
      <div className="row main">
        <Radio.Group
          onChange={(e) => selectedAddress({ selectedAddress: e.target.value })}
          style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}
        >
          <div className="cards-container">
            {addressList &&
              addressList.map((el) => (
                <>
                  <Card>
                    <div className="mb-2">
                      {/* <Radio> */}
                      <Radio value={el.type}> {el.type}</Radio>
                      {/* </Radio> */}
                    </div>
                    <div>{el.addressLine1}</div>
                    <div>
                      {el.addressLine2}-{el.state}:{el.pincode}
                    </div>
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
