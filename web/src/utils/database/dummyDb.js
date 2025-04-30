export const PRODUCT_LISTS = [
  {
    id: 3,
    _id: "34d3a39e3990e14a8c6c79376db2ec6e",
    name: "Balang Air",
    description: null,
    quantity: 4,
    price: "240.00",
    productImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    category: "container",
    available: true,
    craetedAt: "2025-03-18T09:44:01.923Z",
    updatedAt: "2025-03-18T09:44:01.923Z",
  },
  {
    id: 4,
    _id: "7c71ab7202169a6d2145e478d16b2b3c",
    name: "Voucher",
    description: null,
    quantity: 6,
    price: "10.00",
    productImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    category: "gifts",
    available: true,
    craetedAt: "2025-03-18T09:44:24.811Z",
    updatedAt: "2025-03-18T09:44:24.811Z",
  },
  {
    id: 5,
    _id: "80d8e7cdbdb8103380afae3f5abd8387",
    name: "Chair",
    description: "",
    quantity: 20,
    price: "40.00",
    productImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    category: "",
    available: true,
    craetedAt: "2025-03-25T07:50:36.404Z",
    updatedAt: "2025-03-25T07:50:36.404Z",
  },
];

export const PRODUCT = {
  id: 5,
  _id: "985fb233ae74139f73fc46f4942763aa",
  name: "Balang Air",
  description: "Untuk isi air",
  quantity: 7,
  price: "900.00",
  productImage:
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
  category: "",
  available: true,
  craetedAt: "2025-03-17T05:23:08.539Z",
  updatedAt: "2025-03-17T05:23:08.539Z",
};

export const CART_ITEMS = {
  cartId: 3,
  userId: 1,
  totalQuantity: 8,
  totalPrice: "540.00",
  items: [
    {
      id: 26,
      product: {
        id: 4,
        _id: "7c71ab7202169a6d2145e478d16b2b3c",
        name: "voucher",
        price: 10,
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      },
      quantity: 6,
      totalPrice: "60.00",
    },
    {
      id: 27,
      product: {
        id: 3,
        _id: "34d3a39e3990e14a8c6c79376db2ec6e",
        name: "balang air",
        price: 240,
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      },
      quantity: 2,
      totalPrice: "480.00",
    },
  ],
};

export const ORDER = {
  orderId: 26,
  userId: 1,
  name: "haziq",
  email: "haziq@email.com",
  address: "test_address",
  phoneNumber: "0123456789",
  totalAmount: "740.00",
  paid: true,
  orderedProducts: [
    {
      id: 3,
      _id: "34d3a39e3990e14a8c6c79376db2ec6e",
      name: "balang air",
      price: "240.00",
      productImage:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      quantity: 3,
      totalPrice: "720.00",
    },
    {
      id: 4,
      _id: "7c71ab7202169a6d2145e478d16b2b3c",
      name: "voucher",
      price: "10.00",
      productImage:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      quantity: 2,
      totalPrice: "20.00",
    },
  ],
};

export const ORDER_LISTS = [
  {
    orderId: 26,
    userId: 1,
    name: "haziqah abdul halim shah isma",
    email: "haziq@email.com",
    address: "LOT 123, JLN KG BARU, TMN TUN, 32040, SERI MANJUNG, PERAK",
    phoneNumber: "0123456789",
    totalAmount: "740.00",
    paid: true,
    orderedProducts: [
      {
        id: 4,
        _id: "7c71ab7202169a6d2145e478d16b2b3c",
        name: "voucher",
        price: "10.00",
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 2,
        totalPrice: "10.00",
      },
      {
        id: 3,
        _id: "34d3a39e3990e14a8c6c79376db2ec6e",
        name: "balang air",
        price: "240.00",
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 3,
        totalPrice: "240.00",
      },
    ],
  },
  {
    orderId: 25,
    userId: "070fa73a-c798-4028-9f97-4e6ee3d74103",
    name: "azwa",
    email: "azwa@email.com",
    address: "test-address",
    phoneNumber: "0123456789",
    totalAmount: "740.00",
    paid: true,
    orderedProducts: [
      {
        id: 3,
        _id: "34d3a39e3990e14a8c6c79376db2ec6e",
        name: "balang air",
        price: "240.00",
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 3,
        totalPrice: "240.00",
      },
      {
        id: 4,
        _id: "7c71ab7202169a6d2145e478d16b2b3c",
        name: "voucher",
        price: "10.00",
        productImage:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 2,
        totalPrice: "10.00",
      },
    ],
  },
];
