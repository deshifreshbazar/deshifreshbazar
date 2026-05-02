# Deshi Fresh Bazar 🥭

Deshi Fresh Bazar is an Agritech fruit chain initiative delivering safer fruits directly from gardens to your doorstep. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

* **Product Catalog**: Browse through a variety of premium-quality fruits
* **Shopping Cart**: Manage your purchases with an intuitive cart system
* **Package Selection**: Choose from different package sizes for each product
* **Image Gallery**: View our collection of product and delivery images
* **Order Tracking**: Track your order status
* **Responsive Design**: Fully responsive across all devices

## 🛠️ Tech Stack

* **Frontend Framework**: Next.js 13+ with App Router
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **UI Components**: Radix UI
* **State Management**: React Context API
* **Image Optimization**: Next.js Image Component
* **Backend Services**: Supabase (or your preferred BaaS)

## 📦 Project Structure

# Frontend
```plaintext
src/
├── app/                    # Next.js 13 app directory
│   ├── about/             # About page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── contact/           # Contact information
│   ├── fruits/            # Products listing
│   ├── gallery/           # Image gallery
│   ├── privacy/           # Privacy policy
│   ├── product/           # Product details
│   ├── return-policy/     # Return policy
│   ├── terms/             # Terms and conditions
│   └── track-order/       # Order tracking
├── assets/                # Static assets
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
└── contexts/             # React Context providers
```

# Backend 
```plaintext
src/
├── api/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   └── userController.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── users.ts
│   └── validators/
│       ├── auth.ts
│       ├── product.ts
│       └── order.ts
├── config/
│   └── index.ts
├── services/
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── order.service.ts
└── utils/
    ├── logger.ts
    └── helpers.ts
```
## 🚀 Getting Started

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/freshbazar.git
cd freshbazar
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
# Add any other public environment variables here
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Backend Implementation Steps
1. Setup Project
npm init -y
npm install express prisma @prisma/client cors dotenv jsonwebtoken bcryptjs
npm install -D typescript @types/node @types/express

2. Configure TypeScript
tsc --init

4. Initialize Prisma
prisma init

6. Environment Variables
MONGODB_URI=
JWT_SECRET=
PORT=
SUPABASE_DATABASE_DIRECT_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SUPABASE_DATABASE=
NEXT_PUBLIC_SUPABASE_URL=

## 🛠️ Database Schema

![supabase-schema-jftgaryiaxgadhuwiiys](https://github.com/user-attachments/assets/22cea62c-ccf3-434a-adb9-f55f0a415324)

## 📱 Key Features

### Product Management

* Browse products by category
* View detailed product information
* Select package sizes
* Add products to cart

### Shopping Cart

* Add/remove items
* Update quantities
* Change package sizes
* Calculate total with shipping

### User Experience

* Responsive image gallery
* Order tracking system
* Contact information
* Privacy and return policies

## 🔐 Authentication

Authentication is handled using \[Supabase/Firebase/Auth Provider] (e.g., Supabase Auth). Protected routes require users to be logged in. JWT or session-based security is managed by the authentication provider.

## 📚 API Integration

All data interactions are handled via API calls to the backend-as-a-service platform (e.g., Supabase):

* Products
* Cart items
* Orders
* User profiles

API URLs and configurations are stored in environment variables.

## 🌐 Deployment

The app is ready for deployment on [**Vercel**](https://vercel.com):

```bash
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Contact

* Website: [www.deshifreshbazar.com](https://www.deshifreshbazar.com)
* Email: [deshifreshbazar@gmail.com](mailto:deshifreshbazar@gmail.com)
* Phone: 01560001192

## 🙏 Acknowledgments

* [Next.js](https://nextjs.org) team
* [Tailwind CSS](https://tailwindcss.com)
* [Radix UI](https://www.radix-ui.com)
* Our farmers and loyal customers ❤️

