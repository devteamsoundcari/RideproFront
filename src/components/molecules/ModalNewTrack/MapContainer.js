import React, { useState, useEffect } from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

const MapContainer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const [lat, setLat] = useState(4.681475271707987);
  const [lng, setLng] = useState(-74.10880761718745);

  const onMarkerDragEnd = (coord) => {
    setLat(coord.latLng.lat());
    setLng(coord.latLng.lng());
  };

  useEffect(() => {
    props.latitude(lat);
    props.longitude(lng);
  }, [lat, lng, props]);

  const mapOptions = {
    zoomControl: props.isMarkerShown ? true : false,
    mapTypeControl: props.isMarkerShown ? true : false,
    scaleControl: props.isMarkerShown ? true : false,
    streetViewControl: props.isMarkerShown ? true : false,
    rotateControl: props.isMarkerShown ? true : false,
    fullscreenControl: props.isMarkerShown ? true : false
  };

  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: 4.681475271707987, lng: -74.10880761718745 }}
      options={mapOptions}>
      {props.isMarkerShown && (
        <Marker
          draggable={true}
          position={{ lat: lat, lng: lng }}
          onDragEnd={(e) => onMarkerDragEnd(e)}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
      )}
    </GoogleMap>
  );
});

export default MapContainer;
