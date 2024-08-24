import React, { useState } from "react";
import MapSvg from "../components/MapSvg";
import Navbar from "../components/Navbar";

function Main() {
  const initialCities = [];
  const colorPalette = [
    "#14181D",
    "#fff",
    "#e76f51",
    "#f4a261",
    "#e9c46a",
    "#2a9d8f",
    "#e63946",
  ];

  const [selectedCities, setSelectedCities] = useState(
    JSON.parse(localStorage.getItem("selectedCities")) || initialCities
  );

  function handleClick(cityInfo) {
    const cityPlate = cityInfo.properties.number;

    setSelectedCities((prevSelectedCities) => {
      const isSelected = prevSelectedCities.includes(cityPlate);
      const updatedCities = isSelected
        ? prevSelectedCities.filter((city) => city !== cityPlate)
        : [...prevSelectedCities, cityPlate];

      localStorage.setItem("selectedCities", JSON.stringify(updatedCities));

      return updatedCities; // Durumu doğru bir şekilde güncellemek için güncellenen şehirler dizisini döndürün
    });
  }

  return (
    <div>
      <Navbar />
      <MapSvg
        onClick={handleClick}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        colors={colorPalette}
      />
    </div>
  );
}

export default Main;
