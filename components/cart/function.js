export const openCheckout = () => {
  console.log('llpopo');
  const getProductDetails = async () => {
    const response = await fetch('/cart.json');
    const json = await response.json();
    const data = {
      order_details: json,
      domain: 'harish-30.shopify.com',
    };
    console.log(data, 'post data');
    const postResponse = await postData(data);
    console.log(document.getElementById('pickrr-iframe'));
    document.getElementById(
      'pickrr-iframe'
    ).src = `https://checkout-pickrr.netlify.app/?checkoutId=${postResponse.data.checkout_id}`;

    document.getElementById('pickrr-container').style.display = 'flex';
  };

  getProductDetails();
};

const postData = async (data) => {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch('https://pickout.pickrr.com/users/checkout/init/', config);
  const json = await response.json();
  console.log(json, 'apidata');
  return json;
};
