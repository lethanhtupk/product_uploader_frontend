import React from 'react'
import paths from 'components/elements/Icon/paths'

{
  /* <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg> */
}

const Icon = ({ name, fill = '#000', viewBox = '0 0 24 24', style }) => {
  const svgStyles = paths[name]?.type === 'stroke' ? { stroke: fill, fille: 'none' } : { fill }
  return (
    <div className={style}>
      <svg width="100%" height="100%" viewBox={viewBox} style={svgStyles} xmlns="http://www.w3.org/2000/svg">
        {paths[name].path}
      </svg>
    </div>
  )
}

export default Icon