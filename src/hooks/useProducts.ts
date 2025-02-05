import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type Listing = {
  sellerId: string;
  stock: number;
  price: number;
  sellerName: string;
};

type ProductInfo = Product & {
  listings: Listing[];
  lowestPrice: number | null;
  isFavorite: boolean;
};

type CartItem = {
  quantity: number;
  productListing: {
    productId: string;
    stock: number;
    price: number;
  };
};

type CartItemWithDetails = CartItem & {
  product: Product;
  sellerId: string;
  sellerName: string;
};

const getToken = async () => {
  const token = await AsyncStorage.getItem("@token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return token;
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${ApiURL}/api/products`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchProductListings = async (productId: string): Promise<Listing[]> => {
  const response = await fetch(`${ApiURL}/api/products/${productId}/listings`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const listings = await response.json();
  return listings.map(({ stock, price, sellerName, sellerId }: any) => ({
    stock,
    price,
    sellerName,
    sellerId,
  }));
};

const fetchFavorites = async (): Promise<string[]> => {
  const token = await getToken();
  const response = await fetch(`${ApiURL}/api/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  const favorites = await response.json();
  return favorites.map((fav: ProductInfo) => fav.id);
};

const fetchCart = async (): Promise<CartItem[]> => {
  const token = await getToken();
  const response = await fetch(`${ApiURL}/api/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }
  return response.json();
};

const calculateLowestPrice = (listings: Listing[]): number | null => {
  if (listings.length === 0) return null;
  return Math.min(...listings.map((listing) => listing.price));
};

export const useProducts = () => {
  return useQuery<ProductInfo[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const [products, favorites] = await Promise.all([
        fetchProducts(),
        fetchFavorites(),
      ]);
      const productsWithListings = await Promise.all(
        products.map(async (product) => {
          const listings = await fetchProductListings(product.id);
          const lowestPrice = calculateLowestPrice(listings);
          return {
            ...product,
            listings,
            lowestPrice,
            isFavorite: favorites.includes(product.id),
          };
        })
      );
      return productsWithListings;
    },
  });
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const fetchCartItems = async (): Promise<CartItemWithDetails[]> => {
    const cartItems = await fetchCart();
    const products = await fetchProducts();

    return Promise.all(
      cartItems.map(async (item) => {
        const product = products.find(
          (p) => p.id === item.productListing.productId
        );
        if (!product) {
          throw new Error(
            `Product not found for id: ${item.productListing.productId}`
          );
        }
        const listings = await fetchProductListings(product.id);
        const listing = listings.find(
          (l) => l.price === item.productListing.price
        );
        if (!listing) {
          throw new Error(`Listing not found for product: ${product.id}`);
        }
        return {
          ...item,
          product,
          sellerId: listing.sellerId,
          sellerName: listing.sellerName,
        };
      })
    );
  };

  const updateCartItemQuantity = async ({
    productId,
    sellerId,
    quantity,
  }: {
    productId: string;
    sellerId: string;
    quantity: number;
  }) => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/cart`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sellerId, quantity }),
    });
    if (!response.ok) {
      throw new Error("Failed to update cart item quantity");
    }
    return response.json();
  };

  const removeCartItem = async ({
    productId,
    sellerId,
  }: {
    productId: string;
    sellerId: string;
  }) => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sellerId }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
  };

  const addToCart = async ({
    productId,
    sellerId,
    quantity,
  }: {
    productId: string;
    sellerId: string;
    quantity: number;
  }) => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sellerId, quantity }),
    });
    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }
    return response.json();
  };

  const {
    data: cartItems,
    isLoading,
    error,
  } = useQuery<CartItemWithDetails[], Error>({
    queryKey: ["cart"],
    queryFn: fetchCartItems,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.productListing.price,
      0
    );
  };

  return {
    cartItems,
    isLoading,
    error,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    addToCart: addToCartMutation.mutate,
    calculateTotal,
  };
};

export const useProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery<ProductInfo, Error>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const [product, listings, favorites] = await Promise.all([
        fetch(`${ApiURL}/api/products/${productId}`).then((res) => res.json()),
        fetchProductListings(productId),
        fetchFavorites(),
      ]);
      const lowestPrice = calculateLowestPrice(listings);
      return {
        ...product,
        listings,
        lowestPrice,
        isFavorite: favorites.includes(productId),
      };
    },
    initialData: () => {
      const products = queryClient.getQueryData<ProductInfo[]>(["products"]);
      return products?.find((p) => p.id === productId);
    },
  });
};

export const useProductsByCategory = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useQuery<ProductInfo[], Error>({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const products = queryClient.getQueryData<ProductInfo[]>(["products"]);
      if (products) {
        return products.filter((product) => product.categoryId === categoryId);
      }
      const [allProducts, favorites] = await Promise.all([
        fetchProducts(),
        fetchFavorites(),
      ]);
      const filteredProducts = allProducts.filter(
        (product) => product.categoryId === categoryId
      );
      const productsWithListings = await Promise.all(
        filteredProducts.map(async (product) => {
          const listings = await fetchProductListings(product.id);
          const lowestPrice = calculateLowestPrice(listings);
          return {
            ...product,
            listings,
            lowestPrice,
            isFavorite: favorites.includes(product.id),
          };
        })
      );
      return productsWithListings;
    },
  });
};

export type { Product, Listing, ProductInfo, CartItem, CartItemWithDetails };
