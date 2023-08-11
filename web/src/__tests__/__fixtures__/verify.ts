/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export const secret = 'c12092f264d049ffb681e7b27ac41015';
const query =
  'code=0907a61c0c8d55e99db179b68161bc00&shop=test-shop.myshopify.com&state=0.6784241404160823&timestamp=1337178173';
export const webhook =
  '{\n' +
  '  "id": 820982911946154508,\n' +
  '  "admin_graphql_api_id": "gid:\\/\\/shopify\\/Order\\/820982911946154508",\n' +
  '  "app_id": null,\n' +
  '  "browser_ip": null,\n' +
  '  "buyer_accepts_marketing": true,\n' +
  '  "cancel_reason": "customer",\n' +
  '  "cancelled_at": "2021-12-31T19:00:00-05:00",\n' +
  '  "cart_token": null,\n' +
  '  "checkout_id": null,\n' +
  '  "checkout_token": null,\n' +
  '  "client_details": null,\n' +
  '  "closed_at": null,\n' +
  '  "confirmed": false,\n' +
  '  "contact_email": "jon@example.com",\n' +
  '  "created_at": "2021-12-31T19:00:00-05:00",\n' +
  '  "currency": "USD",\n' +
  '  "current_subtotal_price": "398.00",\n' +
  '  "current_subtotal_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "current_total_additional_fees_set": null,\n' +
  '  "current_total_discounts": "0.00",\n' +
  '  "current_total_discounts_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "current_total_duties_set": null,\n' +
  '  "current_total_price": "398.00",\n' +
  '  "current_total_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "current_total_tax": "0.00",\n' +
  '  "current_total_tax_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "customer_locale": "en",\n' +
  '  "device_id": null,\n' +
  '  "discount_codes": [\n' +
  '\n' +
  '  ],\n' +
  '  "email": "jon@example.com",\n' +
  '  "estimated_taxes": false,\n' +
  '  "financial_status": "voided",\n' +
  '  "fulfillment_status": "pending",\n' +
  '  "landing_site": null,\n' +
  '  "landing_site_ref": null,\n' +
  '  "location_id": null,\n' +
  '  "merchant_of_record_app_id": null,\n' +
  '  "name": "#9999",\n' +
  '  "note": null,\n' +
  '  "note_attributes": [\n' +
  '\n' +
  '  ],\n' +
  '  "number": 234,\n' +
  '  "order_number": 1234,\n' +
  '  "order_status_url": "https:\\/\\/jsmith.myshopify.com\\/548380009\\/orders\\/123456abcd\\/authenticate?key=abcdefg",\n' +
  '  "original_total_additional_fees_set": null,\n' +
  '  "original_total_duties_set": null,\n' +
  '  "payment_gateway_names": [\n' +
  '    "visa",\n' +
  '    "bogus"\n' +
  '  ],\n' +
  '  "phone": null,\n' +
  '  "presentment_currency": "USD",\n' +
  '  "processed_at": null,\n' +
  '  "reference": null,\n' +
  '  "referring_site": null,\n' +
  '  "source_identifier": null,\n' +
  '  "source_name": "web",\n' +
  '  "source_url": null,\n' +
  '  "subtotal_price": "393.00",\n' +
  '  "subtotal_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "393.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "393.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "tags": "",\n' +
  '  "tax_lines": [\n' +
  '\n' +
  '  ],\n' +
  '  "taxes_included": false,\n' +
  '  "test": true,\n' +
  '  "token": "123456abcd",\n' +
  '  "total_discounts": "5.00",\n' +
  '  "total_discounts_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "5.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "5.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "total_line_items_price": "398.00",\n' +
  '  "total_line_items_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "398.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "total_outstanding": "398.00",\n' +
  '  "total_price": "403.00",\n' +
  '  "total_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "403.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "403.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "total_shipping_price_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "10.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "10.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "total_tax": "0.00",\n' +
  '  "total_tax_set": {\n' +
  '    "shop_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    },\n' +
  '    "presentment_money": {\n' +
  '      "amount": "0.00",\n' +
  '      "currency_code": "USD"\n' +
  '    }\n' +
  '  },\n' +
  '  "total_tip_received": "0.00",\n' +
  '  "total_weight": 0,\n' +
  '  "updated_at": "2021-12-31T19:00:00-05:00",\n' +
  '  "user_id": null,\n' +
  '  "billing_address": {\n' +
  '    "first_name": "Steve",\n' +
  '    "address1": "123 Shipping Street",\n' +
  '    "phone": "555-555-SHIP",\n' +
  '    "city": "Shippington",\n' +
  '    "zip": "40003",\n' +
  '    "province": "Kentucky",\n' +
  '    "country": "United States",\n' +
  '    "last_name": "Shipper",\n' +
  '    "address2": null,\n' +
  '    "company": "Shipping Company",\n' +
  '    "latitude": null,\n' +
  '    "longitude": null,\n' +
  '    "name": "Steve Shipper",\n' +
  '    "country_code": "US",\n' +
  '    "province_code": "KY"\n' +
  '  },\n' +
  '  "customer": {\n' +
  '    "id": 115310627314723954,\n' +
  '    "email": "john@example.com",\n' +
  '    "accepts_marketing": false,\n' +
  '    "created_at": null,\n' +
  '    "updated_at": null,\n' +
  '    "first_name": "John",\n' +
  '    "last_name": "Smith",\n' +
  '    "state": "disabled",\n' +
  '    "note": null,\n' +
  '    "verified_email": true,\n' +
  '    "multipass_identifier": null,\n' +
  '    "tax_exempt": false,\n' +
  '    "phone": null,\n' +
  '    "email_marketing_consent": {\n' +
  '      "state": "not_subscribed",\n' +
  '      "opt_in_level": null,\n' +
  '      "consent_updated_at": null\n' +
  '    },\n' +
  '    "sms_marketing_consent": null,\n' +
  '    "tags": "",\n' +
  '    "currency": "USD",\n' +
  '    "accepts_marketing_updated_at": null,\n' +
  '    "marketing_opt_in_level": null,\n' +
  '    "tax_exemptions": [\n' +
  '\n' +
  '    ],\n' +
  '    "admin_graphql_api_id": "gid:\\/\\/shopify\\/Customer\\/115310627314723954",\n' +
  '    "default_address": {\n' +
  '      "id": 715243470612851245,\n' +
  '      "customer_id": 115310627314723954,\n' +
  '      "first_name": null,\n' +
  '      "last_name": null,\n' +
  '      "company": null,\n' +
  '      "address1": "123 Elm St.",\n' +
  '      "address2": null,\n' +
  '      "city": "Ottawa",\n' +
  '      "province": "Ontario",\n' +
  '      "country": "Canada",\n' +
  '      "zip": "K2H7A8",\n' +
  '      "phone": "123-123-1234",\n' +
  '      "name": "",\n' +
  '      "province_code": "ON",\n' +
  '      "country_code": "CA",\n' +
  '      "country_name": "Canada",\n' +
  '      "default": true\n' +
  '    }\n' +
  '  },\n' +
  '  "discount_applications": [\n' +
  '\n' +
  '  ],\n' +
  '  "fulfillments": [\n' +
  '\n' +
  '  ],\n' +
  '  "line_items": [\n' +
  '    {\n' +
  '      "id": 866550311766439020,\n' +
  '      "admin_graphql_api_id": "gid:\\/\\/shopify\\/LineItem\\/866550311766439020",\n' +
  '      "attributed_staffs": [\n' +
  '        {\n' +
  '          "id": "gid:\\/\\/shopify\\/StaffMember\\/902541635",\n' +
  '          "quantity": 1\n' +
  '        }\n' +
  '      ],\n' +
  '      "fulfillable_quantity": 1,\n' +
  '      "fulfillment_service": "manual",\n' +
  '      "fulfillment_status": null,\n' +
  '      "gift_card": false,\n' +
  '      "grams": 567,\n' +
  '      "name": "IPod Nano - 8GB",\n' +
  '      "price": "199.00",\n' +
  '      "price_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "199.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "199.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "product_exists": true,\n' +
  '      "product_id": 632910392,\n' +
  '      "properties": [\n' +
  '\n' +
  '      ],\n' +
  '      "quantity": 1,\n' +
  '      "requires_shipping": true,\n' +
  '      "sku": "IPOD2008PINK",\n' +
  '      "taxable": true,\n' +
  '      "title": "IPod Nano - 8GB",\n' +
  '      "total_discount": "0.00",\n' +
  '      "total_discount_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "0.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "0.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "variant_id": 808950810,\n' +
  '      "variant_inventory_management": "shopify",\n' +
  '      "variant_title": null,\n' +
  '      "vendor": null,\n' +
  '      "tax_lines": [\n' +
  '\n' +
  '      ],\n' +
  '      "duties": [\n' +
  '\n' +
  '      ],\n' +
  '      "discount_allocations": [\n' +
  '\n' +
  '      ]\n' +
  '    },\n' +
  '    {\n' +
  '      "id": 141249953214522974,\n' +
  '      "admin_graphql_api_id": "gid:\\/\\/shopify\\/LineItem\\/141249953214522974",\n' +
  '      "attributed_staffs": [\n' +
  '\n' +
  '      ],\n' +
  '      "fulfillable_quantity": 1,\n' +
  '      "fulfillment_service": "manual",\n' +
  '      "fulfillment_status": null,\n' +
  '      "gift_card": false,\n' +
  '      "grams": 567,\n' +
  '      "name": "IPod Nano - 8GB",\n' +
  '      "price": "199.00",\n' +
  '      "price_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "199.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "199.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "product_exists": true,\n' +
  '      "product_id": 632910392,\n' +
  '      "properties": [\n' +
  '\n' +
  '      ],\n' +
  '      "quantity": 1,\n' +
  '      "requires_shipping": true,\n' +
  '      "sku": "IPOD2008PINK",\n' +
  '      "taxable": true,\n' +
  '      "title": "IPod Nano - 8GB",\n' +
  '      "total_discount": "0.00",\n' +
  '      "total_discount_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "0.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "0.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "variant_id": 808950810,\n' +
  '      "variant_inventory_management": "shopify",\n' +
  '      "variant_title": null,\n' +
  '      "vendor": null,\n' +
  '      "tax_lines": [\n' +
  '\n' +
  '      ],\n' +
  '      "duties": [\n' +
  '\n' +
  '      ],\n' +
  '      "discount_allocations": [\n' +
  '\n' +
  '      ]\n' +
  '    }\n' +
  '  ],\n' +
  '  "payment_terms": null,\n' +
  '  "refunds": [\n' +
  '\n' +
  '  ],\n' +
  '  "shipping_address": {\n' +
  '    "first_name": "Steve",\n' +
  '    "address1": "123 Shipping Street",\n' +
  '    "phone": "555-555-SHIP",\n' +
  '    "city": "Shippington",\n' +
  '    "zip": "40003",\n' +
  '    "province": "Kentucky",\n' +
  '    "country": "United States",\n' +
  '    "last_name": "Shipper",\n' +
  '    "address2": null,\n' +
  '    "company": "Shipping Company",\n' +
  '    "latitude": null,\n' +
  '    "longitude": null,\n' +
  '    "name": "Steve Shipper",\n' +
  '    "country_code": "US",\n' +
  '    "province_code": "KY"\n' +
  '  },\n' +
  '  "shipping_lines": [\n' +
  '    {\n' +
  '      "id": 271878346596884015,\n' +
  '      "carrier_identifier": null,\n' +
  '      "code": null,\n' +
  '      "delivery_category": null,\n' +
  '      "discounted_price": "10.00",\n' +
  '      "discounted_price_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "10.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "10.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "phone": null,\n' +
  '      "price": "10.00",\n' +
  '      "price_set": {\n' +
  '        "shop_money": {\n' +
  '          "amount": "10.00",\n' +
  '          "currency_code": "USD"\n' +
  '        },\n' +
  '        "presentment_money": {\n' +
  '          "amount": "10.00",\n' +
  '          "currency_code": "USD"\n' +
  '        }\n' +
  '      },\n' +
  '      "requested_fulfillment_service_id": null,\n' +
  '      "source": "shopify",\n' +
  '      "title": "Generic Shipping",\n' +
  '      "tax_lines": [\n' +
  '\n' +
  '      ],\n' +
  '      "discount_allocations": [\n' +
  '\n' +
  '      ]\n' +
  '    }\n' +
  '  ]\n' +
  '}';

async function sign(data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(data)
  );
}

export async function signedHeader(): Promise<string> {
  const signature = await sign(webhook);
  return btoa(
    String.fromCharCode.apply(
      null,
      Array.from<number>(new Uint8Array(signature))
    )
  );
}
export async function signedQuery(): Promise<string> {
  const signature = await sign(query);
  const hex = Array.prototype.map
    .call(new Uint8Array(signature), (n) => n.toString(16).padStart(2, '0'))
    .join('');
  return query.replace('&shop', `&hmac=${hex}&shop`);
}

export const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxOTE2MjM5MDIyLCJuYmYiOjE1MTYyMzkwMjIsImlzcyI6IlRFU1QgSVNTIiwiZGVzdCI6InRpa2ktZGV2LXN0b3JlLm15c2hvcGlmeS5jb20iLCJhdWQiOiIzM2Q4MmNjZWNkMWEzMTZhNGNiZGI3ZDA5MDczNWZhOCJ9.NiKf3meWitWaK_-6veAowx1MHacW0Sggue-cbMvgnAI';

export const claims = {
  sub: '1234567890',
  exp: 1916239022,
  nbf: 1516239022,
  iss: 'TEST ISS',
  dest: 'tiki-dev-store.myshopify.com',
  aud: '33d82ccecd1a316a4cbdb7d090735fa8',
};
