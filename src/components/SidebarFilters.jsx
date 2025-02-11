import React, { useState } from 'react';
import { Slider, Checkbox, FormGroup, FormControlLabel, Box, Typography } from '@mui/material';

const SidebarFilters = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]); // Defineix el rang inicial
  const [categories] = useState(["pantalla", "portatil", "raton", "movil"]); // Exemples de categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ priceRange: newValue, selectedCategories });
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    const updatedCategories = event.target.checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updatedCategories);
    onFilterChange({ priceRange, selectedCategories: updatedCategories });
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 300 }}>
      <Typography variant="h6">Filtra per Preu</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={1500}
      />
      <Typography variant="h6">Categories</Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                name={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SidebarFilters;
