import L from "leaflet";

export const options = {
    position: 'topleft',
    draw: {
      polyline:false,
      polygon: {
        drawError: {
          color: '#FACC14', // Color the shape will turn when intersects
          message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
        },
        fillColor:"#FACC14",
        shapeOptions: {
          backgroundColor: '#FACC14',
          color: '#FACC14'
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