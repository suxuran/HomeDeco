<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Run the Content Block Seeder (About Page Content)
        // We wrap this in a check in case the class doesn't exist yet, 
        // but based on our progress, it should.
        if (class_exists(ContentBlockSeeder::class)) {
            $this->call(ContentBlockSeeder::class);
        }

        // 2. Create Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@homedeco.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 3. Create Standard User
        User::factory()->create([
            'name' => 'Standard User',
            'email' => 'user@homedeco.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // 4. Seed Products (Raw data from client/data/products.ts)
        $products = [
            [
                "name" => "Modern Living Room Set",
                "description" => "Contemporary 3-piece sofa set with clean lines and premium fabric upholstery. Perfect for modern living spaces.",
                "price" => 1299.99,
                "category" => "Furniture",
                "image" => "https://images.pexels.com/photos/279607/pexels-photo-279607.jpeg",
                "in_stock" => true,
                "is_featured" => true,
            ],
            [
                "name" => "Wooden Dining Table",
                "description" => "Elegant dining table crafted from solid wood, seats 6 people comfortably. Timeless design that complements any dining room.",
                "price" => 899.99,
                "category" => "Furniture",
                "image" => "https://images.pexels.com/photos/32805984/pexels-photo-32805984.jpeg",
                "in_stock" => true,
                "is_featured" => true,
            ],
            [
                "name" => "Decorative Plant Shelves",
                "description" => "Stylish wooden shelving unit perfect for displaying plants, books, and decorative items. Adds natural warmth to any room.",
                "price" => 249.99,
                "category" => "Storage",
                "image" => "https://images.pexels.com/photos/32178067/pexels-photo-32178067.png",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Modern Table Lamp",
                "description" => "Sleek contemporary table lamp with adjustable brightness. Perfect for reading or ambient lighting.",
                "price" => 89.99,
                "category" => "Lighting",
                "image" => "https://images.pexels.com/photos/32791474/pexels-photo-32791474.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Decorative Throw Pillows",
                "description" => "Set of 4 premium throw pillows with unique patterns and textures. Instantly refresh your living space.",
                "price" => 69.99,
                "category" => "Decor",
                "image" => "https://images.pexels.com/photos/27471114/pexels-photo-27471114.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Wall Art Collection",
                "description" => "Set of 4 framed artistic prints featuring modern wildlife themes. Professional quality prints with premium frames.",
                "price" => 199.99,
                "category" => "Decor",
                "image" => "https://images.pexels.com/photos/139764/pexels-photo-139764.jpeg",
                "in_stock" => true,
                "is_featured" => true,
            ],
            [
                "name" => "Home Office Desk",
                "description" => "Compact round table perfect for home office or study area. Modern design with clean lines and sturdy construction.",
                "price" => 349.99,
                "category" => "Furniture",
                "image" => "https://images.pexels.com/photos/5244025/pexels-photo-5244025.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Kitchen Storage Cabinet",
                "description" => "Contemporary kitchen cabinet with ample storage space. Features modern hardware and durable finishes.",
                "price" => 599.99,
                "category" => "Storage",
                "image" => "https://images.pexels.com/photos/5644353/pexels-photo-5644353.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Floor Bookshelf",
                "description" => "Tall wooden bookshelf with multiple compartments. Perfect for organizing books, decor, and personal items.",
                "price" => 299.99,
                "category" => "Storage",
                "image" => "https://images.pexels.com/photos/6135340/pexels-photo-6135340.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Decorative Wall Mirror",
                "description" => "Elegant wall mirror with contemporary frame design. Adds light and space to any room while serving as a stylish accent piece.",
                "price" => 149.99,
                "category" => "Decor",
                "image" => "https://images.pexels.com/photos/32798775/pexels-photo-32798775.jpeg",
                "in_stock" => true,
                "is_featured" => false,
            ],
            [
                "name" => "Luxury Area Rug",
                "description" => "Premium quality area rug with modern geometric pattern. Soft texture and sophisticated colors complement any decor style.",
                "price" => 399.99,
                "category" => "Decor",
                "image" => "https://images.pexels.com/photos/32246936/pexels-photo-32246936.jpeg",
                "in_stock" => true,
                "is_featured" => true,
            ],
            [
                "name" => "Statement Chandelier",
                "description" => "Stunning crystal chandelier that serves as a focal point for dining rooms or entryways. Timeless elegance with modern functionality.",
                "price" => 799.99,
                "category" => "Lighting",
                "image" => "https://images.pexels.com/photos/9288745/pexels-photo-9288745.jpeg",
                "in_stock" => true,
                "is_featured" => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'category' => $product['category'],
                'price' => $product['price'],
                'description' => $product['description'],
                'image' => $product['image'],
                'stock' => $product['in_stock'] ? 50 : 0, // Default stock logic
                'is_featured' => $product['is_featured'],
            ]);
        }
    }
}