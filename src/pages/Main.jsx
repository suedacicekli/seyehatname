import React, { useState } from "react";
import MapSvg from "../components/MapSvg";
import Navbar from "../components/Navbar";

function Main() {
  const initialCities = [];
  const colorPalette1 = [
    "#14181D",
    "#1D232A",
    "#e76f51",
    "#f4a261",
    "#e9c46a",
    "#2a9d8f",
    "#e63946",
  ];

  const colorPalette2 = [
    "#14181D",
    "#1D232A",
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9844a",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#4d908e",
    "#577590",
    "#277da1",
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

      return updatedCities;
    });
  }

  return (
    <div>
      <Navbar />
      <MapSvg
        onClick={handleClick}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        colors={colorPalette2}
      />
    </div>
  );
}

export default Main;
