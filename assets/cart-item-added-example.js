class ProductForm extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('form');
    this.form.querySelector('[name=id]').disabled = false;
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));

  }

  onSubmitHandler(evt) {
    evt.preventDefault();

    // serialize the form and then convert it into an object.

    const formData = new FormData(this.form);
    const formParams = new URLSearchParams(formData);
    const tempObject = Object.fromEntries(formParams);
    let formDataJSON = {};
    // Shopify AJAX Cart API only cares for these parameters.
    const accepted_keys = ['id', 'quantity', 'properties', 'selling_plan']
    for (let key in tempObject) {
      // check if key starts with one of the accepted keys and the value is not empty
      if (accepted_keys.some(accepted_key => key.startsWith(accepted_key)) && tempObject[key] !== "") {
        if (key.startsWith('properties')) {
          if (!formDataJSON['properties']) {
            formDataJSON['properties'] = {};
          }
          let innerKey = key.split('[')[1].split(']')[0];
           // check if value is not empty
          if (tempObject[key] !== "") {
            formDataJSON['properties'][innerKey] = tempObject[key];
          }
        } else {
          if (tempObject[key] !== "") {
            formDataJSON[key] = tempObject[key];
          }
        }
      }
    }

    // if the object strangely has no quantity, make sure we set that and default to 1.
    if (!formDataJSON.hasOwnProperty('quantity')) {
      formDataJSON.quantity = 1;
    }

    // console.log("ProductCard _addItemToCart data", $(data));
    // console.log("ProductCard _addItemToCart formData", formData);
    // console.log("ProductCard _addItemToCart formDataJSON", JSON.stringify(formDataJSON));

    const items_added = [formDataJSON];

    const postBody = {
      items: items_added
    }

    fetch(`${routes.cart_add_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          console.error(response.description);
          return;
        }

        document.dispatchEvent(new CustomEvent("cart:item:added", { detail:
          {
            'response': response,
            'items_added': items_added
          }
        }));
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
customElements.define('product-form', ProductForm);
