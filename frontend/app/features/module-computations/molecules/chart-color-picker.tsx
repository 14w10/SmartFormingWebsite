import { useCallback, useRef, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

import { Icon } from '@smar/ui';

import { useOnClickOutside } from 'libs/use-click-outside';

export const ChartColorPicker = ({
  color,
  setColor,
}: {
  color: ColorResult;
  setColor: (color: ColorResult) => void;
}) => {
  const ref = useRef(null);
  const [isOpen, isOpenSet] = useState(false);
  useOnClickOutside(ref, () => isOpenSet(false));
  const handleChange = useCallback(
    (color: ColorResult) => {
      setColor(color);
    },
    [setColor],
  );

  return (
    <div className="select-none" ref={ref}>
      <div className="flex flex-col relative">
        <button
          className="flex items-center justify-between focus:outline-none py-4px pl-1 pr-12px"
          onClick={() => isOpenSet(prevState => !prevState)}
        >
          <div
            className={`v-text110 ${
              isOpen ? 'text-secondaryDarkBlue910' : 'text-secondaryDarkBlue920'
            }`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
          </div>
          <Icon
            name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={24}
            iconFill={!isOpen ? 'secondaryDarkBlue920' : 'secondaryDarkBlue910'}
          />
        </button>
        {isOpen && (
          <div className="flex absolute mt-4px z-20 w-max" style={{ top: '100%' }}>
            <SketchPicker color={color as any} onChangeComplete={handleChange} />
          </div>
        )}
      </div>
    </div>
  );
};
