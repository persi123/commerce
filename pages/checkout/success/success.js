import React from 'react';
import { Result, Button, Input } from 'antd';
import Image from 'next/image';
import pickrrLogo from '.././pickrrLogo.jpeg';

const success = () => {
  return (
    <div className="custom-container py-5 my-4 my-sm-5" style={{ backgroundColor: 'aliceblue' }}>
      <div>
        <Result
          className="success"
          style={{ backgroundColor: 'white', borderRadius: '20px' }}
          status="success"
          title="Your Order Placed Successfully"
          subTitle="We will send you the update once your order is shipped"
          extra={[
            <div
              style={{
                width: '775px',
                height: '50px',
                display: 'flex',
                paddingRight: '44px',
                margin: 'auto',
              }}
              key="res"
            >
              <Input
                style={{
                  height: '100%!important',
                  width: '443px!important',
                  backgroundColor: '#EDF0F9',
                  borderRadius: '8px',
                }}
              />
              <Button
                style={{
                  height: '100%',
                  borderRadius: '8px',
                  position: 'relative',
                  left: '-19px',
                  width: '314px!important',
                  backgroundColor: '#292A2C',
                  color: '#fff',
                  fontWeight: '700',
                  border: 'black',
                  width: '519px',
                }}
                // onClick={() => handleSelectedAddress({ pendingOtp: false })}
              >
                Get Newsletter
              </Button>
            </div>,
          ]}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <div
          style={{
            display: ' flex',
            width: '800px',
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '20px',
          }}
        >
          <div style={{ borderBottom: '1px solid rgb(215 217 221)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '12px',
                width: '100%',
                backgroundColor: 'black',
                color: 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '400px',
                  marginRight: '79px',
                }}
              >
                <p>Products</p>
                <p>Price</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                <p>Products</p>
                <p>Price</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                color: 'black',
                padding: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '400px',
                  marginRight: '79px',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <div className="product-image">
                    <Image
                      src={pickrrLogo}
                      //   style={{ height: "67px", width: "66px", borderRadius: "10px" }}
                    />
                  </div>
                  <span style={{ width: '130px' }}>Experience Pickrr Plus with us</span>
                </div>
                <p>Price</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                <p>Products</p>
                <p>Price</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                color: 'black',
                padding: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '400px',
                  marginRight: '79px',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <div className="product-image">
                    <Image
                      src={pickrrLogo}
                      //   style={{ height: "67px", width: "66px", borderRadius: "10px" }}
                    />
                  </div>
                  <span style={{ width: '130px' }}>Experience Pickrr Plus with us</span>
                </div>
                <p>Price</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                <p>Products</p>
                <p>Price</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div>Subtotal</div>
              <div>123344</div>
            </div>
            <div
              style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div>Subtotal</div>
              <div>123344</div>
            </div>
            <div
              style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid rgb(215 217 221)',
              }}
            >
              <div>Subtotal</div>
              <div>123344</div>
            </div>
            <div
              style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div>
                <b> Total</b>
              </div>
              <div>
                <b>5000</b>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '580px', backgroundColor: 'white', borderRadius: '20px' }}>
          <div style={{ padding: '34px', fontWeight: '600', fontSize: '17px' }}>Order Id #1234</div>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '34px' }}>
              <div style={{ fontWeight: '600' }}>Payment Mode</div>
              <div>Cedit / Debit Card</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '34px',
                paddingTop: '10px',
                borderBottom: '1px solid rgb(215 217 221)',
              }}
              //   style={{ borderBottom: "1px solid rgb(215 217 221)" }}
            >
              <div style={{ fontWeight: '600' }}>Your Order Will reach you by</div>
              <div>17th Sep 2021, Sunday</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '34px' }}>
              <div style={{ fontWeight: '600' }}>Delivey Address</div>
              <div>Advik 13th mani road river view colony mani road river view Delhi - 599955</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '34px' }}>
              <div style={{ fontWeight: '600' }}>Billing Address</div>
              <div style={{ fontWeight: 'normal' }}>
                Advik 13th mani road river view colony mani road river view Delhi - 599955
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default success;
