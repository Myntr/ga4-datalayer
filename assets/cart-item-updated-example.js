class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input');
    this.input.addEventListener('change', this.onChangeHandler.bind(this));
    this.cartItem = this.closest('.cart-item');
    this.cartItems = this.closest('.cart-items');
  }

  onChangeHandler(evt) {
    evt.preventDefault();

    if(!this.cartItem) return;

    let data = { updates: {} };
    let newQty = parseInt(this.input.value);
    let previousQty = parseInt(this.input.dataset.previousQuantity);
    let items_changed = [];
    let eventType = null;
    let quantityDifference = 0;
    if(newQty === 0 ){
      eventType = 'mini-cart-item-remove';
      quantityDifference = previousQty;
    }
    else if(newQty > previousQty){
      eventType = 'mini-cart-item-quantity-add';
      quantityDifference = (newQty - previousQty);
    }else{
      eventType = 'mini-cart-item-quantity-remove';
      quantityDifference = (previousQty - newQty);
    }

    const dataLayerInfo = {
      eventType: eventType
    }

    // build the list of items. Push to the updates object for the cart api, and items_changed for datalayer.
    data.updates[`${this.cartItem.dataset.key}`] = newQty;
    items_changed.push({
      quantity_changed: quantityDifference,
      quantity: newQty,
      id: this.cartItem.dataset.key
    });

    // if the product is bundled, find associated products. in this case we will send the unique key, but the quantities should be based off the triggering input to keep values in sync.
    const bundleId = this.cartItem.dataset.bundleId;
    if(bundleId){
      const bundledItems = this.cartItems.querySelector(`.cart-item[data-bundle-id="${this.cartItem.dataset.bundleId}"]:not([data-key="${this.cartItem.dataset.key}"])`);
      if(bundledItems){
        bundledItems.forEach((bundleItem)=>{
          data.updates[`${bundleItem.dataset.key}`] = newQty;
          items_changed.push({
            quantity_changed: quantityDifference,
            quantity: newQty,
            id: bundleItem.dataset.key
          });
        });
      }
    }

    if(eventType === "mini-cart-item-remove"){
      let cartBeforeRemoval = null;
      fetch(`${routes.cart_url}.js`)
        .then((response) => response.json())
        .then((fetchedCart) => {
          cartBeforeRemoval = fetchedCart;
          fetch(`${routes.cart_add_url}.js`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                console.error(response.description);
                return;
              }
              document.dispatchEvent(new CustomEvent('cart:item:updated', { detail: {
                "response": cartBeforeRemoval,
                "event": dataLayerInfo,
                "items_changed": items_changed
              }}));
              // do whatever else is needed to update the cart view on the client site here
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      fetch(`${routes.cart_add_url}.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            console.error(response.description);
            return;
          }
          document.dispatchEvent(new CustomEvent('cart:item:updated', { detail: {
            "response": data,
            "event": dataLayerInfo,
            "items_changed": items_changed
          }}));
          // do whatever else is needed to update the cart view on the client site here
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
}
customElements.define('quantity-input', QuantityInput);
