document.addEventListener("DOMContentLoaded", () => {
  //   console.log(btn, "jj");
  let btn = document.getElementById("pickrr-checkout-btn");
  console.log(btn, "jj");
  //   btn.addEventListener("click", openCheckout);
  let pickrrContainer = document.createElement("div");
  pickrrContainer.id = "pickrr-container";
  pickrrContainer.style.display = "none";
  pickrrContainer.style.zIndex = "9999";
  pickrrContainer.style.position = "absolute";
  pickrrContainer.style.top = "0";
  pickrrContainer.style.left = "0";
  pickrrContainer.style.height = "100%";
  pickrrContainer.style.width = "100%";
  pickrrContainer.style.justifyContent = "center";
  pickrrContainer.style.alignItems = "center";
  pickrrContainer.style.background = "rgba(0,0,0,0.5)";

  let pickrrDiv = document.createElement("div");
  if (window.innerWidth > 576) {
    pickrrDiv.style.height = "90vh";
  } else {
    pickrrDiv.style.height = "-webkit-fill-available";
  }
  if (window.innerWidth > 576) {
    pickrrDiv.style.width = "90vw";
  } else {
    pickrrDiv.style.width = "100vw";
  }
  pickrrDiv.style.opacity = "1";

  pickrrContainer.appendChild(pickrrDiv);

  let pickrrBtnContainer = document.createElement("div");
  pickrrBtnContainer.style.display = "flex";
  pickrrBtnContainer.style.justifyContent = "space-between";
  pickrrBtnContainer.style.paddingTop = "10px";
  pickrrBtnContainer.style.backgroundColor = "#e5e5e5";
  if (window.innerWidth > 576) {
    pickrrBtnContainer.style.borderRadius = "10px 10px 0px 0px";
  } else {
    pickrrBtnContainer.style.borderRadius = "0px";
  }

  pickrrDiv.appendChild(pickrrBtnContainer);

  if (window.innerWidth > 576) {
    let pickrrCloseText = document.createElement("span");
    pickrrCloseText.innerText = "";
    pickrrCloseText.style.cssText =
      " font-size:18px; font-weight:bold; color: #263f97; padding:0px 20px; font-family: proxima-nova, sans-serif; ";
    pickrrCloseText.className = "trackContainer";
    pickrrBtnContainer.appendChild(pickrrCloseText);
    let pickrrCloseBtn = document.createElement("button");
    pickrrCloseBtn.innerText = "X";
    pickrrCloseBtn.style.borderRadius = "50%";
    pickrrCloseBtn.style.background = "#b4bad6";
    pickrrCloseBtn.style.color = "#fff";
    pickrrCloseBtn.style.fontSize = "14px";
    pickrrCloseBtn.style.display = "flex";
    pickrrCloseBtn.style.alignItems = "center";
    pickrrCloseBtn.style.marginRight = "10px";
    pickrrCloseBtn.style.justifyContent = "center";
    pickrrCloseBtn.style.height = "30px";
    pickrrCloseBtn.style.width = "30px";
    pickrrCloseBtn.style.border = "none";
    pickrrCloseBtn.style.outline = "none";
    pickrrCloseBtn.style.cursor = "pointer";
    pickrrCloseBtn.addEventListener("click", () => {
      document.getElementById("pickrr-container").style.display = "none";
    });

    pickrrBtnContainer.appendChild(pickrrCloseBtn);
  } else {
    let pickrrBackButton = document.createElement("img");
    pickrrBackButton.src = "https://d10srchmli830n.cloudfront.net/1639056105214_arrow1.svg";
    pickrrBackButton.style.cursor = "pointer";
    pickrrBackButton.style.marginLeft = "10px";
    pickrrBackButton.addEventListener("click", () => {
      document.getElementById("pickrr-container").style.display = "none";
    });

    pickrrBtnContainer.appendChild(pickrrBackButton);
  }

  let pickrrIframe = document.createElement("iframe");
  pickrrIframe.id = "pickrr-iframe";
  pickrrIframe.frameBorder = "0";
  if (window.innerWidth > 576) {
    pickrrIframe.style.height = "90vh";
  } else {
    pickrrIframe.style.height = "-webkit-fill-available";
  }
  if (window.innerWidth > 576) {
    pickrrIframe.style.width = "90vw";
  } else {
    pickrrIframe.style.width = "100vw";
  }
  pickrrIframe.style.margin = "0";
  if (window.innerWidth > 576) {
    pickrrIframe.style.borderRadius = "0px 0px 10px 10px";
  } else {
    pickrrIframe.style.borderRadius = "0px";
  }
  pickrrIframe.style.backgroundColor = "#fff";

  pickrrDiv.appendChild(pickrrIframe);
  document.body.appendChild(pickrrContainer);

  if (new URLSearchParams(window.location.search).get("checkout_id")) {
    openAbandonedCheckout(new URLSearchParams(window.location.search).get("checkout_id"));
  }
});

// const postData = async (data) => {
//   const config = {
//     method: "POST",
//     body: JSON.stringify(data),
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   const response = await fetch("https://pickout.pickrr.com/users/checkout/init/", config);
//   const json = await response.json();
//   console.log(json, "apidata");
//   return json;
// };

// const openCheckout = () => {
//   const getProductDetails = async () => {
//     const response = await fetch("/cart.json");
//     const json = await response.json();
//     const data = {
//       order_details: json,
//       domain: "harish-30.shopify.com",
//     };
//     console.log(data, "post data");
//     const postResponse = await postData(data);
//     document.getElementById(
//       "pickrr-iframe"
//     ).src = `https://checkout-pickrr.netlify.app/?checkoutId=${postResponse.data.checkout_id}`;

//     document.getElementById("pickrr-container").style.display = "flex";
//   };

//   getProductDetails();
// };

const openAbandonedCheckout = (checkoutId) => {
  document.getElementById(
    "pickrr-iframe"
  ).src = `https://checkout-pickrr.netlify.app/?checkoutId=${checkoutId}`;

  document.getElementById("pickrr-container").style.display = "flex";
};
