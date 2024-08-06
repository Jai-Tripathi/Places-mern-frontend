import React, { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import Leaflet from "leaflet";
import "leaflet-defaulticon-compatibility";

import "./Map.css";

const Map = (props) => {
    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        const map = Leaflet.map(mapRef.current).setView(center, zoom);

        Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        Leaflet.marker(center).addTo(map);
    }, [center, zoom]);

    return (
        <div
            ref={mapRef}
            className={`map ${props.className}`}
            style={props.style}
        ></div>
    );
};

export default Map;