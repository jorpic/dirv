import { useRef, useEffect } from "preact/hooks";
import * as d3 from "d3";

export function LineChart({data, width, height}) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .attr("class", "bar-chart")
      .attr("viewBox", [-20, 0, width, height+20])
      .attr("width", width+20)
      .attr("height", height+20);

    const x = d3.scaleLinear()
      .domain([0, 20])
      .range([0, width]);
    const y = d3.scaleLinear()
      .domain([0, 60])
      .range([height, 20]);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    svg.append("g")
      .call(d3.axisLeft(y));

    const xs = [7,12,8,6,4,5,2,10,14,17,33,21,2,1,7,8,2].map((v, t) => ({t, v}));
    svg.append("path")
      .datum(xs)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.t))
        .y(d => y(d.v))
        )
      ;

    return () => svg.selectChildren().remove();
  }, [data]);


  return <svg ref={svgRef}/>;
}
