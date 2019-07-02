import React, { Component } from 'react';
import SvgUri from './svg-uri';

export default function createIconSet(svg, fontName) {
    return class Icon extends Component {
        render () {
            const { icon, color, size, style, value } = this.props;
            let svgXmlData = svg[icon];

            if (!svgXmlData) {
                let err_msg = `no "${icon}"`;
                throw new Error(err_msg);
            }
            return (
                <SvgUri width={size} height={size} svgXmlData={svgXmlData} fill={color} style={style} value={value?value:icon} />
            );
        }
    };
}
