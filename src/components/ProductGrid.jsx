import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import SidebarFilters from "./SidebarFilters"; // Importa el component de filtres

const stripePromise = loadStripe(
  "pk_test_51QSgAiBNoAIrMHfdrqMMFCgqvBXCJ9ymEpmjB0u8QzZUfrkNRN3DU1FEtI5Pe63YEgz5T3FwmpOvHpuR9hzGn0op00jZoKkROE"
);

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data); // Inicialment, mostrar tots els productes
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleFilterChange = ({ priceRange, selectedCategories }) => {
    const [minPrice, maxPrice] = priceRange;

    // Filtrar productes per preu i categoria
    const filtered = products.filter((product) => {
      const withinPriceRange = product.price >= minPrice && product.price <= maxPrice;
      const inSelectedCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return withinPriceRange && inSelectedCategory;
    });

    setFilteredProducts(filtered);
  };

  const handleBuyNow = async (product) => {
    const stripe = await stripePromise;

    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: product.name,
              price: product.price,
              quantity: 1, // Sempre compra una unitat
            },
          ],
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error al processar el pagament:", error);
      alert("No s'ha pogut completar el pagament.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={2}>
        {/* Sidebar de filtres */}
        <Grid item xs={12} sm={4} md={3}>
          <SidebarFilters onFilterChange={handleFilterChange} />
        </Grid>

        {/* Llistat de productes */}
        <Grid item xs={12} sm={8} md={9}>
          <Grid container spacing={3}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageURL}
                      alt={product.name}
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      <Typography variant="h6" sx={{ marginTop: "10px" }}>
                        €{product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBuyNow(product)}
                        sx={{ marginTop: "10px" }}
                      >
                        Comprar ara
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ marginTop: "20px" }}>
                No hi ha productes disponibles amb els criteris seleccionats.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductGrid;
