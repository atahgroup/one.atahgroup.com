"use client";

import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";

interface CountryFeature {
  properties?: {
    ADMIN: string;
    ISO_A2: string;
    POP_EST: number;
  };
}

const WorldPropertyMap = () => {
  const [countries, setCountries] = useState({ features: [] });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with 0 or a sensible default for SSR safety
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 1. Fetch Data
    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Error loading globe data:", err));

    // 2. Handle Resize logic
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          // Calculate height based on viewport minus the 56px offset
          height: window.innerHeight - 56,
        });
      }
    };

    // Initialize size immediately
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    /* Ensure the wrapper div matches the intended height 
       to prevent layout shifts or empty gaps.
    */
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <Globe
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonUseDots={true}
        hexPolygonColor={() =>
          `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`
        }
        hexPolygonLabel={(o: CountryFeature) => `
          <div style="padding: 5px; background: rgba(0,0,0,0.8); border-radius: 4px; color: white; font-family: sans-serif;">
            <b>${o.properties?.ADMIN} (${o.properties?.ISO_A2})</b> <br />
            Population: <i>${o.properties?.POP_EST.toLocaleString()}</i>
          </div>
        `}
      />
    </div>
  );
};

export default WorldPropertyMap;
