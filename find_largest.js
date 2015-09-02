function find_largest(d) {
  var areas = [];
  var threshold = 0.9;
  d.geometry.coordinates = d.geometry.coordinates.filter(function(c, i) {
    var test = copy(d);
    test.geometry.coordinates = [test.geometry.coordinates[i]];
    var a = path.area(test);
    if (a >= threshold) {
      areas.push(a);
      return true;
    }
    return false;
  });
  areas.sort(function(a,b) { return a-b; });

  var reduced = copy(d),
      largest = copy(d);
  reduced.geometry.coordinates = reduced.geometry.coordinates.filter(function(c, i) {
    var test = copy(d);
    test.geometry.coordinates = [test.geometry.coordinates[i]];
    var a = path.area(test);
    if (a == areas[areas.length-1]) {
      largest.geometry.coordinates = test.geometry.coordinates;
    }
    return a >= d3.quantile(areas, .9);
  });

  var coords = largest.geometry.coordinates[0];

  if (coords && largest.geometry.type === "MultiPolygon") {
    coords = coords[0];
    largest.geometry.coordinates[0] = coords;
    largest.geometry.type = "Polygon";
  }
  return largest;
}

function copy(source) {
  return JSON.parse(JSON.stringify(source));
}
