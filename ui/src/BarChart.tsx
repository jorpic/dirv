import { useRef, useEffect } from "preact/hooks";
import * as d3 from "d3";

export function BarChart({size, width, height}) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .attr("class", "bar-chart")
      .attr("viewBox", [-20, 0, width, height+20])
      .attr("width", width+20)
      .attr("height", height+20);

    const x = d3.scaleBand()
      .domain(["a", "b", "c", "d"])
      .range([0, width])
      .padding([0.7]);
    const y = d3.scaleLinear()
      .domain([0, 60])
      .range([height, 20]);
    const color = d3.scaleOrdinal()
      .domain(["a", "b", "c", "d"])
      .range(d3.schemePastel1);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("g")
      .selectAll("g")
      .data([{key: "a", val: 15}, {key: "c", val: 33}])
      .join("rect")
        .attr("fill", d => color(d.key))
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.val))
        .attr("height", d => y(0) - y(d.val))
        .attr("width", x.bandwidth())
      ;

    return () => svg.selectChildren().remove();
  }, [size]);


  return <svg ref={svgRef}/>;
}
