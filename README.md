![Myntr](https://imgur.com/laewQrV.png)

# GA4 DataLayer #

This repo contains all necessary files for Shopify theme GA4 implementations. The files are organized into standard Shopify theme directories.

## Documentation ##
View the comprehensive [Notion document](https://www.notion.so/myntr/GA4-ffcd6b7ad45f42d5809ab1bbfac019b2)

## How To ##

1. Insert GTM script into `<head>` within `theme.liquid` and `checkout.liquid`
```
<!-- Google Tag Manager -->
 <script>
 (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{settings.gtm_id}}');
 </script>
<!-- End Google Tag Manager -->
```

2. Insert GTM script into `<body>` within `theme.liquid` and `checkout.liquid`
```
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{settings.gtm_id}}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

3. Add schema to `settings_schema.json` and then input the client's GTM ID
```
{
  "name": "GTM Data Layer",
  "settings": [
    {
      "type": "text",
      "id": "gtm_id",
      "label": "GTM ID",
      "info": "Insert Google Tag Manager ID"
    },
    {
      "type": "checkbox",
      "id": "gtm_debug",
      "label": "Enable debugging",
      "info": "If checked, events will be pushed to the 'myntrLayer' object and development logs will show in the browser console.",
      "default": false
    }
  ]
}
```

4. Add new snippet: `datalayer.liquid`
5. Add new snippet: `product-datalayer.liquid`
6. Add new snippet: `datalayer-promo-attrs.liquid`
7. Add new snippet: `get-query-string.liquid`
8. Add new product template: `product.datalayer.liquid`
9. Add new cart template: `cart.datalayer.liquid`
10. Render `datalayer.liquid` snippet near the end of the `</body>` tag on `theme.liquid` and `checkout.liquid`
11. Add the code from file `datalayer-purchase.liquid` to Checkout Additional Scripts