export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string; // Laravel sends decimals as strings usually, or numbers
    image_url: string; // This comes from our Controller logic
    category: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}