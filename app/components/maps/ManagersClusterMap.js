"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { memo, useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

const ManagersClusterMap = memo(function ManagersClusterMap({
  gridData,
  whichCoord,
  heightx,
}) {
  const [managersCords, setManagersCords] = useState([]);

  useEffect(() => {
    const managersCors = gridData.map((row) => {
      if (!row[whichCoord]) {
        return undefined;
      }
      const coordinatex = row[whichCoord]?.trim();

      if (coordinatex) {
        try {
          const xcord = JSON.parse(coordinatex);
          const newArray = [xcord.lat, xcord.lng];

          return {
            fullName: row["firstName"] + " " + row["lastName"],
            organResName: row["organResName"],
            organName: row["organName"],
            avatar: row["avatar"],
            [whichCoord]: [...newArray],
          };
        } catch (error) {
          return undefined;
        }
      } else {
        return undefined;
      }
    });

    const managersCorsx = managersCors.filter((e) => e);

    setManagersCords(managersCorsx);
  }, [gridData]);

  return (
    <MapContainer
      center={[33.693268775735085, 52.40472784281421]}
      zoom={6}
      style={{ width: "100%", height: heightx }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        maxClusterRadius={150}
        spiderfyOnMaxZoom={true}
        polygonOptions={{
          fillColor: "#ffffff",
          color: "#0070f0",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3,
        }}
        showCoverageOnHover={true}
      >
        {managersCords.map((itemx, index) => {
          return (
            <Marker
              key={index}
              position={[...itemx[whichCoord]]}
              title={itemx.fullName}
            >
              <Popup>
                <div style={{ direction: 'rtl', textAlign: 'right' , fontFamily:"__iransans_7c92e5"}} >
                  <img
                    src={
                      itemx.avatar
                        ? process.env.NEXT_PUBLIC_API_ROOT +
                          "/AvatarImage/" +
                          itemx.avatar
                        : "/img/noPhoto.png"
                    }
                    className="thumbnail-image"
                    style={{width: 200,
                      height: 200}}
                  />
                  
                  <p><strong>نام</strong>: {itemx.fullName}</p>
                  <p><strong> دستگاه </strong>: {itemx.organName}</p>
                  <p><strong> پست</strong>: {itemx.organResName}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default ManagersClusterMap;
