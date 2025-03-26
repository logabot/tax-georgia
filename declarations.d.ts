declare module '*.scss' {
    const content: { [className: string]: string };
    export = content;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    import React from 'react';
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module '*.pdf' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}
