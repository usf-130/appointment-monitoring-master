"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
  useMapEvents,
  Pane,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Button } from "react-bootstrap";
import Image from "next/image";

const GeoPick = forwardRef(({ onChange, initLocation, defaultValue }, ref) => {
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

  const [xposition, setXposition] = useState(
    initLocation
      ? initLocation
      : defaultValue
      ? JSON.parse(defaultValue)
      : { lat: 35.272505690179834, lng: 47.01599875234892 }
  );

  const [draggable, setDraggable] = useState(initLocation ? false : true);
  const [zoom, setZoom] = useState(initLocation ? 15 : 8);

  useImperativeHandle(ref, () => ({
    getDraggableState: () => draggable,
  }));

  const markerRef = useRef(null);

  const handelConfirm = () => {
    setDraggable(false);
    onChange(xposition);
  };

  const handelChange = () => {
    setDraggable(true);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setXposition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const setPositionTo = (pos) => {
    setXposition(pos);
  };

  return (
    <>
      <MapContainer
        center={xposition}
        zoom={zoom}
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

        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={xposition}
          ref={markerRef}
        >
          <Popup isRtl={true} minWidth={90}>
            <span>
              {draggable
                ? "پین را به لوکیشن مورد نظر بکشید(یا در محل مورد نظر دو بار کلیک کنید) و دکمه تایید لوکیشن را بزنید"
                : "لوکیشن انتخاب شده است. برای تغییر روی دکمه تغییر لوکیشن کلیک کنید."}
            </span>
          </Popup>
        </Marker>

        {draggable && <Recenter positionx={xposition} />}
        {draggable && <DbClick setPositionTo={setPositionTo} />}
        {draggable && <FindMyLocation setPositionTo={setPositionTo} />}
        {
          <ConfirmLocation
            draggable={draggable}
            ConfirmLocationx={handelConfirm}
            ChangeLocation={handelChange}
          />
        }
      </MapContainer>
    </>
  );
});

export default GeoPick;

const Recenter = ({ positionx }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(positionx);
  }, [positionx]);
};

const DbClick = ({ setPositionTo }) => {
  useMapEvents({
    dblclick: (location) => {
      setPositionTo(location.latlng);
    },
  });
};

const FindMyLocation = ({ setPositionTo }) => {
  const map = useMap();
  const customIcon = new L.Icon({
    iconUrl: "/img/map-icons/myLoc.gif",
    iconSize: [32, 32],
  });

  const handleLocationClick = () => {
    map.locate().on("locationfound", function (e) {
      map.setZoom(18);
      setPositionTo(e.latlng);
    });
  };

  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right ">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          <Image
            onClick={handleLocationClick}
            role="button"
            className="leaflet-control-zoom-in"
            title="یافتن لوکیشن من"
            height={32}
            width={32}
            src={customIcon.options.iconUrl}
            alt="My Location"
            style={{ transition: "transform 0.08s" }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
      </div>
    </div>
  );
};

const ConfirmLocation = ({ ConfirmLocationx, ChangeLocation, draggable }) => {
  return (
    <div className="leaflet-control-container">
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          <Button
            type="button"
            size="lg"
            className="map-button"
            variant={draggable ? "light" : "secondary"}
            role="button"
            title={
              draggable ? "تایید لوکیشن انتخاب شده" : "تغییر لوکیشن انتخاب شده"
            }
            onClick={draggable ? ConfirmLocationx : ChangeLocation}
          >
            {draggable ? "تایید لوکیشن" : "ویرایش لوکیشن"}
          </Button>
        </div>
      </div>
    </div>
  );
};
