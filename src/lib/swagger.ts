const authSecurity = [{ CookieAuth: [] }, { BearerAuth: [] }];

const jsonContent = (schema: Record<string, unknown>) => ({
  'application/json': { schema },
});

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Fresh Bazar API',
    version: '1.0.0',
    description: 'Centralized API documentation for the Fresh Bazar application.',
  },
  tags: [
    { name: 'Auth', description: 'Authentication and account access' },
    { name: 'Users', description: 'User registration and profile endpoints' },
    { name: 'Products', description: 'Storefront product endpoints' },
    { name: 'Orders', description: 'Customer order endpoints' },
    { name: 'Upload', description: 'File upload endpoints' },
    { name: 'Admin Categories', description: 'Admin category management endpoints' },
    { name: 'Admin Products', description: 'Admin product management endpoints' },
    { name: 'Admin Orders', description: 'Admin order management endpoints' },
    { name: 'Admin Stats', description: 'Admin dashboard statistics endpoints' },
    { name: 'Admin Users', description: 'Admin user reporting endpoints' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string', nullable: true },
          image: { type: 'string', nullable: true },
        },
      },
      Package: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          details: { type: 'string', nullable: true },
          price: { type: 'number' },
          image: { type: 'string' },
          stock: { type: 'integer' },
          sequence: { type: 'integer' },
          category: { $ref: '#/components/schemas/Category' },
          packages: {
            type: 'array',
            items: { $ref: '#/components/schemas/Package' },
          },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'description', 'price', 'image', 'categoryId', 'slug'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          details: { type: 'string' },
          price: { type: 'number' },
          image: { type: 'string' },
          categoryId: { type: 'string' },
          stock: { type: 'integer' },
          slug: { type: 'string' },
          packages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price: { type: 'number' },
              },
            },
          },
        },
      },
      OrderItemInput: {
        type: 'object',
        required: ['id', 'name', 'image', 'quantity', 'price', 'totalPrice'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          image: { type: 'string' },
          quantity: { type: 'integer' },
          price: { type: 'number' },
          totalPrice: { type: 'number' },
          selectedPackage: { type: 'string', nullable: true },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string', nullable: true },
          productName: { type: 'string' },
          productImage: { type: 'string' },
          quantity: { type: 'integer' },
          unitPrice: { type: 'number' },
          totalPrice: { type: 'number' },
          packageType: { type: 'string', nullable: true },
        },
      },
      CreateOrderInput: {
        type: 'object',
        required: [
          'fullName',
          'email',
          'phone',
          'address',
          'city',
          'postalCode',
          'country',
          'items',
          'subtotal',
          'total',
          'paymentMethod',
        ],
        properties: {
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItemInput' },
          },
          subtotal: { type: 'number' },
          shipping: { type: 'number' },
          total: { type: 'number' },
          paymentMethod: { type: 'string' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string', nullable: true },
          customerName: { type: 'string' },
          customerEmail: { type: 'string' },
          customerPhone: { type: 'string' },
          shippingAddress: { type: 'string' },
          shippingCity: { type: 'string' },
          shippingPostalCode: { type: 'string' },
          shippingCountry: { type: 'string' },
          subtotal: { type: 'number' },
          shippingCost: { type: 'number' },
          totalAmount: { type: 'number' },
          paymentMethod: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', nullable: true },
          token: { type: 'string' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', nullable: true },
        },
      },
      UpdateProfileInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      UploadResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          filePath: { type: 'string' },
          message: { type: 'string' },
        },
      },
      CategoryInput: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string' },
        },
      },
      ProductReorderInput: {
        type: 'object',
        required: ['products'],
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'sequence'],
              properties: {
                id: { type: 'string' },
                sequence: { type: 'integer' },
              },
            },
          },
        },
      },
      AdminOrdersResponse: {
        type: 'object',
        properties: {
          orders: {
            type: 'array',
            items: { $ref: '#/components/schemas/Order' },
          },
          totalPages: { type: 'integer' },
        },
      },
      AdminOrderStatusInput: {
        type: 'object',
        required: ['orderId', 'status'],
        properties: {
          orderId: { type: 'string' },
          status: { type: 'string' },
        },
      },
      AdminStats: {
        type: 'object',
        properties: {
          totalOrders: { type: 'integer' },
          totalProducts: { type: 'integer' },
          totalUsers: { type: 'integer' },
          recentOrders: { type: 'integer' },
        },
      },
      MonthlyOrderStats: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          year: { type: 'integer' },
          totalOrders: { type: 'integer' },
          deliveredOrders: { type: 'integer' },
          pendingOrders: { type: 'integer' },
        },
      },
      AdminUserSummary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', nullable: true },
          email: { type: 'string', format: 'email' },
          role: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          ordersCount: { type: 'integer' },
          totalSpent: { type: 'number' },
          lastOrder: {
            oneOf: [
              { $ref: '#/components/schemas/Order' },
              { type: 'null' },
            ],
          },
          deliveredCount: { type: 'integer' },
          pendingCount: { type: 'integer' },
        },
      },
    },
  },
  paths: {
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        description: 'Creates a new user account and returns a JWT token.',
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/RegisterInput' }),
        },
        responses: {
          '200': {
            description: 'User created successfully',
            content: jsonContent({ $ref: '#/components/schemas/AuthResponse' }),
          },
          '400': {
            description: 'Invalid input or user already exists',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticates a user and returns a JWT token.',
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/LoginInput' }),
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: jsonContent({ $ref: '#/components/schemas/AuthResponse' }),
          },
          '400': {
            description: 'Email and password are required',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Invalid credentials',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        description: 'Returns the authenticated user profile.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'User profile',
            content: jsonContent({ $ref: '#/components/schemas/UserProfile' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '404': {
            description: 'User not found',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update current user profile',
        description: 'Updates name, email, or password for the authenticated user.',
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/UpdateProfileInput' }),
        },
        responses: {
          '200': {
            description: 'Updated user profile',
            content: jsonContent({ $ref: '#/components/schemas/UserProfile' }),
          },
          '400': {
            description: 'Invalid update request',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '404': {
            description: 'User not found',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        description: 'Returns the storefront product list with category and package data.',
        responses: {
          '200': {
            description: 'Product list',
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create order',
        description: 'Creates a new order for a guest or authenticated user.',
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/CreateOrderInput' }),
        },
        responses: {
          '200': {
            description: 'Order created successfully',
            content: jsonContent({ $ref: '#/components/schemas/Order' }),
          },
          '500': {
            description: 'Failed to create order',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'List current user orders',
        description: 'Returns all orders for the authenticated user.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'User orders',
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/Order' },
            }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Failed to fetch orders',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get single order',
        description: 'Returns a single order belonging to the authenticated user.',
        security: authSecurity,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          '200': {
            description: 'Order details',
            content: jsonContent({ $ref: '#/components/schemas/Order' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '404': {
            description: 'Order not found',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Failed to fetch order',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload product image',
        description: 'Uploads a JPEG, PNG, or WebP file to Supabase storage.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File uploaded successfully',
            content: jsonContent({ $ref: '#/components/schemas/UploadResponse' }),
          },
          '400': {
            description: 'Invalid file input',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      delete: {
        tags: ['Upload'],
        summary: 'Delete uploaded image',
        description: 'Deletes a product image from Supabase storage.',
        parameters: [
          {
            name: 'path',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Stored file path',
          },
        ],
        responses: {
          '200': {
            description: 'File deleted successfully',
            content: jsonContent({
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
              },
            }),
          },
          '400': {
            description: 'Missing file path',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/categories': {
      get: {
        tags: ['Admin Categories'],
        summary: 'List categories',
        description: 'Returns all categories for admin management.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'Category list',
            content: jsonContent({
              type: 'object',
              properties: {
                categories: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
            }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      post: {
        tags: ['Admin Categories'],
        summary: 'Create category',
        description: 'Creates a new category.',
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/CategoryInput' }),
        },
        responses: {
          '200': {
            description: 'Category created successfully',
            content: jsonContent({ $ref: '#/components/schemas/Category' }),
          },
          '400': {
            description: 'Validation failed or category already exists',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/products': {
      get: {
        tags: ['Admin Products'],
        summary: 'List products for admin',
        description: 'Returns paginated products for the admin dashboard.',
        security: authSecurity,
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated products',
            content: jsonContent({
              type: 'object',
              properties: {
                products: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
                totalPages: { type: 'integer' },
              },
            }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      post: {
        tags: ['Admin Products'],
        summary: 'Create product',
        description: 'Creates a new product and optional package rows.',
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/ProductInput' }),
        },
        responses: {
          '200': {
            description: 'Product created successfully',
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '400': {
            description: 'Validation failed',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/products/{id}': {
      get: {
        tags: ['Admin Products'],
        summary: 'Get product by id',
        description: 'Returns a single product for admin editing.',
        security: authSecurity,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Product details',
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '404': {
            description: 'Product not found',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      put: {
        tags: ['Admin Products'],
        summary: 'Update product',
        description: 'Updates an existing product and replaces its packages.',
        security: authSecurity,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/ProductInput' }),
        },
        responses: {
          '200': {
            description: 'Updated product',
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '400': {
            description: 'Validation failed',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      delete: {
        tags: ['Admin Products'],
        summary: 'Delete product',
        description: 'Deletes a product and its packages.',
        security: authSecurity,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Product deleted successfully',
            content: jsonContent({
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Failed to delete product',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/products/reorder': {
      post: {
        tags: ['Admin Products'],
        summary: 'Reorder products',
        description: 'Updates the display sequence for multiple products.',
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/ProductReorderInput' }),
        },
        responses: {
          '200': {
            description: 'Products reordered successfully',
            content: jsonContent({
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            }),
          },
          '400': {
            description: 'Invalid request body',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/orders': {
      get: {
        tags: ['Admin Orders'],
        summary: 'List orders for admin',
        description: 'Returns paginated orders with optional search, status, and sort filters.',
        security: authSecurity,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          '200': {
            description: 'Paginated order list',
            content: jsonContent({ $ref: '#/components/schemas/AdminOrdersResponse' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Error fetching orders',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
      patch: {
        tags: ['Admin Orders'],
        summary: 'Update order status',
        description: 'Updates the status of an order.',
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/AdminOrderStatusInput' }),
        },
        responses: {
          '200': {
            description: 'Order status updated',
            content: jsonContent({
              type: 'object',
              properties: {
                order: { $ref: '#/components/schemas/Order' },
              },
            }),
          },
          '400': {
            description: 'Order ID and status are required',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Error updating order status',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/orders/export': {
      get: {
        tags: ['Admin Orders'],
        summary: 'Export orders',
        description: 'Exports orders to an Excel file with optional date filtering.',
        security: authSecurity,
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: {
          '200': {
            description: 'Excel file response',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
          '500': {
            description: 'Failed to export orders',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/stats': {
      get: {
        tags: ['Admin Stats'],
        summary: 'Get dashboard stats',
        description: 'Returns admin dashboard counters.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'Dashboard statistics',
            content: jsonContent({ $ref: '#/components/schemas/AdminStats' }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Error fetching statistics',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/stats/monthly-orders': {
      get: {
        tags: ['Admin Stats'],
        summary: 'Get monthly order stats',
        description: 'Returns monthly order totals for the last 12 months.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'Monthly order statistics',
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/MonthlyOrderStats' },
            }),
          },
          '401': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Error fetching statistics',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin Users'],
        summary: 'List users for admin',
        description: 'Returns users with order and spending summary data.',
        security: authSecurity,
        responses: {
          '200': {
            description: 'User summary list',
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/AdminUserSummary' },
            }),
          },
          '401': {
            description: 'Not authenticated',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '403': {
            description: 'Not authorized',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
          '500': {
            description: 'Internal server error',
            content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
          },
        },
      },
    },
  },
};

export const getApiDocs = async () => openApiSpec;
