var educationUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
var countiesUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

var width = 1000;
var height = 650;

var svg = d3.select("#graph").
append("svg").
attr("width", width).
attr("height", height);

var path = d3.geoPath();

var tooltip = d3.select("#graph").
append("div").
attr("id", "tooltip").
style("opacity", 0);

d3.queue().
defer(d3.json, countiesUrl).
defer(d3.json, educationUrl).
await(ready);

function ready(error, counties, education) {
  if (error) console.log(error);

  svg.append("g").
  selectAll("path").
  data(topojson.feature(counties, counties.objects.counties).features).
  enter().
  append("path").
  attr("d", path).
  attr("class", "county").
  attr("data-fips", function (e) {return e.id;}).
  attr("data-education", function (e) {
    var county = education.filter(function (f) {
      if (f.fips === e.id) return f.bachelorsOrHigher;
    });
    return county[0].bachelorsOrHigher;
  }).
  style("stroke", "white").
  style("fill", function (e) {
    var edu = education.filter(function (f) {
      if (f.fips === e.id) return f.bachelorsOrHigher;
    });
    var bach = edu[0].bachelorsOrHigher;
    if (bach < 15) return "red";else
    if (bach >= 15 && bach < 30) return "orange";else
    if (bach >= 30 && bach < 45) return "yellow";else
    return "green";
  }).
  on("mouseover", function (e) {
    tooltip.transition().
    duration(200).
    style("opacity", .9);
    tooltip.html(function () {
      var county = education.filter(function (f) {
        if (f.fips === e.id) return f;
      });
      return "<span class='tooltipSpan'>County: </span>" + county[0].area_name + "<br>" +
      "<span class='tooltipSpan'>State: </span>" + county[0].state + "<br>" +
      "<span class='tooltipSpan'>Bachelor or higher: </span>" + county[0].bachelorsOrHigher + "%";
    }).
    attr("data-education", function () {
      var county = education.filter(function (f) {
        if (f.fips === e.id) return f.bachelorsOrHigher;
      });
      return county[0].bachelorsOrHigher;
    }).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - 65 + "px").
    attr("id", "tooltip");
  }).
  on("mouseout", function (e) {
    tooltip.transition().
    duration(500).
    style("opacity", 0);
  });
}

var legend = svg.append("g").
attr("id", "legend");

legend.append("rect").
attr("x", width - 140).
attr("y", height - 200).
attr("width", 30).
attr("height", 30).
style("fill", "green");

legend.append("rect").
attr("x", width - 140).
attr("y", height - 165).
attr("width", 30).
attr("height", 30).
style("fill", "yellow");

legend.append("rect").
attr("x", width - 140).
attr("y", height - 130).
attr("width", 30).
attr("height", 30).
style("fill", "orange");

legend.append("rect").
attr("x", width - 140).
attr("y", height - 95).
attr("width", 30).
attr("height", 30).
style("fill", "red");

legend.append("text").
text("> 45%").
attr("x", width - 60).
attr("y", height - 185).
style("text-anchor", "middle").
style("alignment-baseline", "middle").
style("font-family", "Lato");

legend.append("text").
text("30% - 44%").
attr("x", width - 60).
attr("y", height - 150).
style("text-anchor", "middle").
style("alignment-baseline", "middle").
style("font-family", "Lato");

legend.append("text").
text("15% - 29%").
attr("x", width - 60).
attr("y", height - 115).
style("text-anchor", "middle").
style("alignment-baseline", "middle").
style("font-family", "Lato");

legend.append("text").
text("< 15%").
attr("x", width - 60).
attr("y", height - 80).
style("text-anchor", "middle").
style("alignment-baseline", "middle").
style("font-family", "Lato");