import createIconSet from './creact-icon-set.native';
// 即上面转换得到的 svg.js
import svg from './svgs';

const Icon = createIconSet(svg, 'rn_components');

export default Icon;

export { createIconSet };
