import Annotator from './annotator';
import Color from '../../visualization/color';

class Reference extends Annotator {
    annotate(chart, target, style) {
        let svg = chart.svg();
        let focus_elements = svg.selectAll(".mark")
            .filter(function (d) {
                if (target.length === 0) {
                    return true
                }
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        return true
                    }
                }
                return false
            });

        if (focus_elements.empty()) return;

        // step 1: get all focused elements position
        let positions = [];
        focus_elements.nodes().forEach(one_element => {
            let data_x, data_y;
            const nodeName = one_element.nodeName;
            if (nodeName === "circle") {
                data_x = parseFloat(one_element.getAttribute("cx"));
                data_y = parseFloat(one_element.getAttribute("cy"));
            } else if (nodeName === "rect") {
                data_x = parseFloat(one_element.getAttribute("x")) + parseFloat(one_element.getAttribute("width")) / 2;
                data_y = parseFloat(one_element.getAttribute("y"));
            }
            if (data_x && data_y) {
                positions.push([data_x, data_y]);
            }
        })

        // step 2: get content range
        // range on X
        let x_axis_path = svg.selectAll('.axis_x').select(".domain");
        let x_axis_bbox = x_axis_path.node().getBBox();
        let x_lower_bound = x_axis_bbox.x;
        let x_upper_bound = x_lower_bound + x_axis_bbox.width;

        // step 3: get value line parameters
        // params for value line
        let x1, x2, y1, y2;

        // process params for value line 
        if (positions.length === 1) { // horizontal line
            y1 = positions[0][1];
            y2 = y1;

            x1 = x_lower_bound;
            x2 = x_upper_bound;
        } else { // calculate value 
            const mean = this.getAverageValue(positions);

            y1 = mean;
            y2 = y1;

            x1 = x_lower_bound;
            x2 = x_upper_bound;
        }

        // step 4: draw value line
        svg.append("line")
            .attr("class", "value")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .attr("stroke", function() {
                if ('color' in style) {
                    return style['color']
                } else {
                    return Color().ANNOTATION
                }
            })
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "8, 4");

    }

    /**
     * average value on given data points
     * @param {*} points positions of points to draw a value line
     * @returns average value
     */
    getAverageValue(points) {
        let sumY = 0
        let N = points.length

        for (let i = 0; i < N; ++i) {
            sumY += points[i][1]
        }
        console.log(points, sumY, N, sumY/N)

        return sumY/N;
    }
}

export default Reference;