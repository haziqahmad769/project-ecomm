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

export const ORDER = {
  OrderId: 12,
  userId: "22eb8d6e-4a6e-4941-9de7-83c53c0f59fa",
  name: "John Doe",
  email: "johndoe@example.com",
  address: "123, Jalan Bukit, Kuala Lumpur, 50000, Malaysia",
  phoneNumber: "+60123456789",
  totalAmount: "560.00",
  orderedProducts: [
    {
      id: 3,
      _id: "34d3a39e3990e14a8c6c79376db2ec6e",
      name: "Balang Air",
      price: 240,
      productImage:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      quantity: 2,
    },
    {
      id: 4,
      _id: "7c71ab7202169a6d2145e478d16b2b3c",
      name: "Voucher",
      price: 10,
      productImage:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      quantity: 8,
    },
  ],
};

export const ORDER_LISTS = [
  {
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
        id: 4,
        _id: "7c71ab7202169a6d2145e478d16b2b3c",
        name: "voucher",
        price: "10.00",
        productImage:
          "http://localhost:8585/uploads/ce15689c-f86f-4807-8b45-984b73ba22e8.jpg",
        quantity: 2,
        totalPrice: "10.00",
      },
      {
        id: 3,
        _id: "34d3a39e3990e14a8c6c79376db2ec6e",
        name: "balang air",
        price: "240.00",
        productImage:
          "http://localhost:8585/uploads/062d4b29-f1d5-4e5a-8a94-62c3ad59ba57.jpeg",
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
          "http://localhost:8585/uploads/062d4b29-f1d5-4e5a-8a94-62c3ad59ba57.jpeg",
        quantity: 3,
        totalPrice: "240.00",
      },
      {
        id: 4,
        _id: "7c71ab7202169a6d2145e478d16b2b3c",
        name: "voucher",
        price: "10.00",
        productImage:
          "http://localhost:8585/uploads/ce15689c-f86f-4807-8b45-984b73ba22e8.jpg",
        quantity: 2,
        totalPrice: "10.00",
      },
    ],
  },
];
