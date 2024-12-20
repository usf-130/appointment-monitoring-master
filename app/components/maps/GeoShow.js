import { MapContainer, TileLayer, Marker, Pane } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";

const GeoShow = ({ geoData }) => {
  useEffect(() => {
    (async function init() {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
      });
    })();
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col xs={6} md={2}>
            <div className="mx-2 my-2">
              <strong>استان: </strong>
              {geoData.province}
            </div>
            <div className="mx-2 my-4">
              <strong>شهرستان: </strong>
              {geoData.country}
            </div>
            {geoData.city &&  <div className="mx-2 my-4">
              <strong>شهر: </strong>
              {geoData.city}
            </div>}
           
            <div className="mx-2 my-4">
              <strong>بخش: </strong>
              {geoData.distinct}
            </div>
            {geoData.neighbourhood && <div className="mx-2 my-4">
              <strong>محله: </strong>
              {geoData.neighbourhood}
            </div>}
            {geoData.village && <div className="mx-2 my-4">
              <strong>روستا: </strong>
              {geoData.village}
            </div>}
            
          </Col>
          <Col xs={12} md={10}>
            <MapContainer
              center={JSON.parse(geoData.location)}
              zoom={16}
              style={{ height: "65vh", width: "100%" }}
              scrollWheelZoom={true}
              doubleClickZoom={false}
              fullscreenControl={true}
              animate={true}
              easeLinearity={0.35}
            >
              <Pane name="tiles" style={{ zIndex: 1 }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </Pane>

              <Marker position={JSON.parse(geoData.location)}></Marker>
            </MapContainer>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={6} md={12}>
            <div>
              <strong>آدرس: </strong>
              {geoData.address}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GeoShow;
