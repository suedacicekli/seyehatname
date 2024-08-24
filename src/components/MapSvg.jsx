import React, { useEffect, useRef } from "react";
import Tooltip from "./Tooltip";
import * as d3 from "d3";

function MapSvg({ selectedCities, onClick, colors }) {
  const tooltipRef = useRef();
  const svgRef = useRef();

  const MAP_COLOR = colors[0];
  const HOVER_COLOR = colors[1];
  const SELECTED_COLORS = colors.slice(2);

  const getSelectedColor = (cityIndex) => {
    return SELECTED_COLORS[cityIndex % SELECTED_COLORS.length];
  };

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

      const svg = d3.select(svgRef.current);
      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

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
                )
              : HOVER_COLOR
          );

        })
        .on("mouseout", function (event, d) {
          const isSelected = selectedCities.includes(d.properties.number);
          d3.select(this).attr(
            "fill",
            isSelected
              ? getSelectedColor(selectedCities.indexOf(d.properties.number))
              : MAP_COLOR
          );
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

      svg
        .selectAll("text")
        .data(data.features)
        .join("text")
        .attr("id", (d) => `text-${d.properties.number}`) 
        .text((d) => d.properties.name)
        .attr("x", (d) => pathGenerator.centroid(d)[0])
        .attr("y", (d) => pathGenerator.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("font-size", "6pt") 
        .attr("pointer-events", "none")
        .attr("fill", "#FBFBFB")
        .attr("fill-opacity", 0.7);
    });
  }, [selectedCities, colors]);

  return (
    <div id="mapContainer" style={{ width: "100%", height: "auto" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "auto" }}></svg>{" "}
      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}

export default MapSvg;
