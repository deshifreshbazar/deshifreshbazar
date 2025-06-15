const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const category = await prisma.category.create({
    data: {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh and delicious fruits',
      image: 'https://example.com/fruits.jpg'
    }
  });

  // Create products
  const products = [
    {
      name: 'হিমসাগর আম (বিষমুক্ত)',
      slug: 'himsagor-mango',
      description: 'মিষ্টি স্বাদ ও রসালো গঠনের জন্য জনপ্রিয় এই আম সাতক্ষীরা ও রাজশাহী অঞ্চল থেকে সংগ্রহ করা হয়।',
      price: 160,
      image: 'https://example.com/himsagor.jpg',
      categoryId: category.id,
      stock: 100,
      packages: [
        { name: '10 kg', price: 1600 },
        { name: '20 kg', price: 2880 }
      ]
    },
    {
      name: 'ল্যাংড়া আম (বিষমুক্ত)',
      slug: 'langra-mango',
      description: 'ল্যাংড়া আমের স্বাদ ও সুগন্ধের জন্য এটি বাংলাদেশের অন্যতম জনপ্রিয় আম।',
      price: 160,
      image: 'https://example.com/langra.jpg',
      categoryId: category.id,
      stock: 100,
      packages: [
        { name: '10 kg', price: 1600 },
        { name: '20 kg', price: 2880 }
      ]
    },
    {
      name: 'হাড়িভাঙ্গা আম (বিষমুক্ত)',
      slug: 'haribhanga-mango',
      description: 'হাড়িভাঙ্গা আম বাংলাদেশের ঐতিহ্যবাহী জাতের আম।',
      price: 150,
      image: 'https://example.com/haribhanga.jpg',
      categoryId: category.id,
      stock: 100,
      packages: [
        { name: '10 kg', price: 1500 },
        { name: '20 kg', price: 2700 }
      ]
    },
    {
      name: 'গোপালভোগ আম',
      slug: 'gopalvog-mango',
      description: 'গোপালভোগ আম তার মিষ্টি স্বাদ ও সুবাসের জন্য বিখ্যাত।',
      price: 160,
      image: 'https://example.com/gopalvog.jpg',
      categoryId: category.id,
      stock: 100,
      packages: [
        { name: '10 kg', price: 1600 },
        { name: '20 kg', price: 2880 }
      ]
    }
  ];

  for (const product of products) {
    const { packages, ...productData } = product;
    const createdProduct = await prisma.product.create({
      data: productData
    });

    // Create packages for the product
    for (const pkg of packages) {
      await prisma.package.create({
        data: {
          ...pkg,
          productId: createdProduct.id
        }
      });
    }
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 