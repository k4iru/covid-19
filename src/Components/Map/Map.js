import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./map.css";
import { renderOnMap } from "../../util/renderOnMap";

function Map({ countries, caseType, center, zoom }) {
  
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom} >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderOnMap(countries, caseType)}
      </LeafletMap>
    </div>
  );
}

export default Map;