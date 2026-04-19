"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";

const GEO_URL = "/geo/countries-110m.json";

const THAILAND_ORIGIN: [number, number] = [100.5, 13.75];

// ISO 3166-1 numeric codes
const CHINA_ID = 156;
const THAILAND_ID = 764;
// Highlight neighbouring countries for geographic context
const NEIGHBOR_IDS = new Set([104, 116, 418, 704, 356]);

type MapDestination = {
  city: string;
  coords: [number, number];
};

// Geographic center labels for each country (visible within the projection frame)
const CHINA_LABEL_COORDS: [number, number] = [104, 36];
const THAILAND_LABEL_COORDS: [number, number] = [101, 16];

type CountryLabels = {
  china: string;
  thailand: string;
};

type Props = {
  destinations: MapDestination[];
  originLabel: string;
  countryLabels: CountryLabels;
};

export function LogisticsChinaMap({ destinations, originLabel, countryLabels }: Props) {
  const labelLines = originLabel.replace("\\n", "\n").split("\n");

  return (
    <div className="overflow-hidden rounded-[2.4rem] border border-[#0f4e7a] bg-[#003366] p-4 shadow-[0_22px_56px_rgba(0,24,48,0.24)]">
      <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10">
        {/* Map badge */}
        <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white/72 shadow-sm backdrop-blur-sm">
          Transportation Network
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [108, 30], scale: 820 }}
          style={{ width: "100%", height: "auto", display: "block" }}
          viewBox="0 0 800 760"
        >
          {/* Ocean background */}
          <rect x={0} y={0} width={800} height={760} fill="#001e3c" />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoId = +geo.id;
                const isChina = geoId === CHINA_ID;
                const isThailand = geoId === THAILAND_ID;
                const isNeighbor = NEIGHBOR_IDS.has(geoId);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={-1}
                    fill={
                      isChina
                        ? "#0d4a80"
                        : isThailand
                          ? "#1a6642"
                          : isNeighbor
                            ? "#0c3b66"
                            : "#0a2e55"
                    }
                    stroke="#ffffff"
                    strokeWidth={isChina || isThailand ? 0.7 : 0.2}
                    strokeOpacity={isChina || isThailand ? 0.45 : 0.12}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: isChina ? "#1358a0" : isThailand ? "#22804f" : undefined },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Animated dashed route lines */}
          {destinations.map((dest, i) => (
            <Line
              key={dest.city}
              from={THAILAND_ORIGIN}
              to={dest.coords}
              stroke="#FFB100"
              strokeWidth={2.5}
              strokeDasharray="6 10"
              strokeLinecap="round"
              strokeOpacity={1}
              fill="none"
              className="animate-[logistics-arc-dash_4s_linear_infinite]"
              style={{ 
                animationDelay: `${i * 0.25}s`,
                filter: "drop-shadow(0 0 6px rgba(255, 177, 0, 0.7))"
              }}
            />
          ))}

          {/* Country name labels */}
          <Marker coordinates={CHINA_LABEL_COORDS}>
            <text
              textAnchor="middle"
              fill="rgba(255,255,255,0.65)"
              fontSize={22}
              fontWeight="700"
              letterSpacing="0.1em"
              style={{ fontFamily: "sans-serif", pointerEvents: "none" }}
            >
              {countryLabels.china}
            </text>
          </Marker>
          <Marker coordinates={THAILAND_LABEL_COORDS}>
            <text
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={9}
              fontWeight="600"
              letterSpacing="0.06em"
              style={{ fontFamily: "sans-serif", pointerEvents: "none" }}
            >
              {countryLabels.thailand}
            </text>
          </Marker>

          {/* Thailand origin marker */}
          <Marker coordinates={THAILAND_ORIGIN}>
            <circle
              r={16}
              fill="#F6D9A4"
              fillOpacity={0.25}
              stroke="#F6D9A4"
              strokeWidth={2}
              strokeOpacity={0.6}
              className="animate-[logistics-marker-pulse_2.2s_ease-in-out_infinite]"
            />
            <circle r={7} fill="#FFB100" stroke="#ffffff" strokeWidth={2.5} />
            {labelLines.map((line, i) => (
              <text
                key={i}
                x={0}
                y={-24 - (labelLines.length - 1 - i) * 11}
                textAnchor="middle"
                fill="white"
                fontSize={8}
                fontWeight="700"
                letterSpacing="0.12em"
                style={{ fontFamily: "sans-serif", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
              >
                {line}
              </text>
            ))}
          </Marker>

          {/* Destination markers */}
          {destinations.map((dest, i) => (
            <Marker key={dest.city} coordinates={dest.coords}>
              <circle
                r={15}
                fill="#F6D9A4"
                fillOpacity={0.2}
                stroke="#F6D9A4"
                strokeWidth={2}
                strokeOpacity={0.5}
                className="animate-[logistics-marker-pulse_2.2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
              <circle r={6} fill="#FFB100" stroke="#ffffff" strokeWidth={2} />
              <text
                y={-18}
                textAnchor="middle"
                fill="white"
                fontSize={7.5}
                fontWeight="700"
                style={{ fontFamily: "sans-serif", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
              >
                {dest.city}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
