import React from "react";
import { Input, Button, Checkbox } from "antd";
import { CustomCheck } from "../addressComponent/style";

const index = ({ handleSelectedAddress }) => {
  return (
    <div>
      <div className="font-size-display2" style={{ fontWeight: "700" }}>
        OTP Verification
      </div>
      <div style={{ marginTop: "56px", fontWeight: "700" }}>
        <div className="font-size-subheader">Enter OTP</div>
        <div
          style={{
            width: "775px",
            height: "50px",
            display: "flex",
            paddingRight: "44px",
          }}
        >
          <Input
            style={{
              height: "100%!important",
              width: "443px!important",
              backgroundColor: "#EDF0F9",
              borderRadius: "8px",
            }}
          />
          <Button
            style={{
              height: "100%",
              borderRadius: "8px",
              position: "relative",
              left: "-19px",
              width: "314px!important",
              backgroundColor: "#292A2C",
              color: "#fff",
              fontWeight: "700",
              border: "black",
              width: "519px",
            }}
            onClick={() => handleSelectedAddress({ otpVerified: true })}
          >
            Submit
          </Button>
        </div>
      </div>
      <CustomCheck style={{ marginTop: "10px" }}>
        Remember my information on this device
      </CustomCheck>
    </div>
  );
};

export default index;
