import L from "leaflet";

export const options = {
    position: 'topleft',
    draw: {
      polyline:false,
      polygon: {
        drawError: {
          color: '#e1e100', // Color the shape will turn when intersects
          message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
        },
        shapeOptions: {
          color: '#bada55'
        }
      }, 
      rectangle: false,
      circlemarker:false,
      circle:false,
      marker:false
    },
    edit: {
      featureGroup: new L.FeatureGroup(), //REQUIRED!!
    }
  }