import React, { useEffect, useRef } from "react";
import Tooltip from "./Tooltip";
import * as d3 from "d3";

function MapSvg({ selectedCities, onClick, colors }) {
  const tooltipRef = useRef();
  const svgRef = useRef(); // SVG referansı oluşturun

  // Renkleri dışarıdan al
  const MAP_COLOR = colors[0];
  const HOVER_COLOR = colors[1];
  const SELECTED_COLORS = colors.slice(2);

  // Seçili şehirler için renk atama fonksiyonu
  const getSelectedColor = (cityIndex) => {
    return SELECTED_COLORS[cityIndex % SELECTED_COLORS.length];
  };

  // Renk açma fonksiyonu
  const adjustColorBrightness = (color, percent) => {
    let R = parseInt(color.slice(1, 3), 16);
    let G = parseInt(color.slice(3, 5), 16);
    let B = parseInt(color.slice(5, 7), 16);

    R = Math.min(255, Math.floor(R + (255 - R) * percent));
    G = Math.min(255, Math.floor(G + (255 - G) * percent));
    B = Math.min(255, Math.floor(B + (255 - B) * percent));

    return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(
      2,
      "0"
    )}${B.toString(16).padStart(2, "0")}`;
  };

  useEffect(() => {
    d3.json("tr-cities.json").then((data) => {
      const width = 1200;
      const height = 550;
      const projection = d3.geoEqualEarth().fitSize([width, height], data);
      const pathGenerator = d3.geoPath().projection(projection);

      // SVG'yi sadece bir kez oluştur
      const svg = d3.select(svgRef.current);
      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      // Haritayı çizin ve güncellenebilir duruma getirin
      const paths = svg.selectAll("path").data(data.features);

      paths
        .join("path")
        .attr("d", pathGenerator)
        .attr("fill", (d) =>
          selectedCities.includes(d.properties.number)
            ? getSelectedColor(selectedCities.indexOf(d.properties.number))
            : MAP_COLOR
        )
        .attr("stroke", "#000")
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          const isSelected = selectedCities.includes(d.properties.number);
          d3.select(this).attr(
            "fill",
            isSelected
              ? adjustColorBrightness(
                  getSelectedColor(selectedCities.indexOf(d.properties.number)),
                  0.2
                ) // 20% açma
              : HOVER_COLOR
          );

          // Şehir ismini göstermek için:
          svg
            .select(`#text-${d.properties.number}`)
            .style("visibility", "visible");
        })
        .on("mouseout", function (event, d) {
          const isSelected = selectedCities.includes(d.properties.number);
          d3.select(this).attr(
            "fill",
            isSelected
              ? getSelectedColor(selectedCities.indexOf(d.properties.number))
              : MAP_COLOR
          );

          // Şehir ismini gizlemek için:
          svg
            .select(`#text-${d.properties.number}`)
            .style("visibility", "hidden");
        })
        .on("click", function (event, d) {
          onClick(d);
          const isSelected = selectedCities.includes(d.properties.number);
          d3.select(this).attr(
            "fill",
            isSelected
              ? MAP_COLOR
              : getSelectedColor(selectedCities.indexOf(d.properties.number))
          );
        });

      // Şehir isimlerini ekle
      svg
        .selectAll("text")
        .data(data.features)
        .join("text")
        .attr("id", (d) => `text-${d.properties.number}`) // Her şehir için benzersiz bir ID ver
        .text((d) => d.properties.name)
        .attr("x", (d) => pathGenerator.centroid(d)[0])
        .attr("y", (d) => pathGenerator.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("font-size", "10pt") // İstenilen yazı boyutunu ayarlayabilirsiniz
        .attr("pointer-events", "none")
        .attr("fill", "#000")
        .style("visibility", "hidden"); // Başlangıçta gizle
    });
  }, [selectedCities, colors]); // colors prop'unu da bağımlılıklar arasına ekleyin

  return (
    <div id="mapContainer" style={{ width: "100%", height: "auto" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "auto" }}></svg>{" "}
      {/* SVG'yi burada oluşturun */}
      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}

export default MapSvg;
