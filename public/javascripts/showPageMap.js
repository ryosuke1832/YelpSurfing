
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "cluster-map", // container ID
    style: "mapbox://styles/mapbox/satellite-v9", // style URL
    center: surfpoint.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl(),'top-right');


  new mapboxgl.Marker()
    .setLngLat(surfpoint.geometry.coordinates)
    .setPopup(
            new mapboxgl.Popup({ offset:25 })
            .setHTML(`<h4>${surfpoint.title}</h4><p>${surfpoint.location}</p>`)
    )
    .addTo(map);
