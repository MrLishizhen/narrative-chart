import Annotator from './annotator';

/**
 * @description An annotator for drawing symbols.
 * 
 * @class
 * @extends Annotator
 */
class Symbol extends Annotator {

    /**
     * @description Draw symbols for target marks.
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        let focus_elements = svg.selectAll(".mark")
            .filter(function(d) {
                if (target.length === 0) {
                    return true
                }
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        continue
                    } else {
                        return false
                    }
                }
                return true
            });
        
        // if the focus defined in the spec does not exist
        if (focus_elements.length === 0) {
            return;
        }

        for(let focus_element of focus_elements.nodes()) {

            // identify the position
            let data_x, data_y, data_r, offset_y;
            const size_icon = 20;
            const nodeName = focus_element.nodeName;
            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - size_icon;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                data_x = bbox.x + bbox.width / 2;
                data_y = bbox.y;
                offset_y = 10;
            } else { // currently not support
                return;
            }

            // append icon
            svg.append("image")
                .attr("class", "icon-img")
                .attr("x", data_x - size_icon / 2)
                .attr("y", data_y + offset_y)
                .attr("width", size_icon)
                .attr("height", size_icon)
                .attr("xlink:href", () => {
                    if("icon-url" in style) {
                        return style["icon-url"];
                    } else {
                        return ;
                    }
                })
        
        }   
            
    }
}

export default Symbol;