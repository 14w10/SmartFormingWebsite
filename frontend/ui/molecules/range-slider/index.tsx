import { ChangeEvent, FC, FocusEvent, useCallback, useMemo, useState } from 'react';
import {
  SliderHandle,
  SliderInput,
  SliderMarker,
  SliderTrack,
  SliderTrackHighlight,
} from '@reach/slider';
import cn from 'clsx';

import { Icon, Input, Typography } from '@smar/ui';

import st from './styles.module.scss';

type RangeSliderProps = {
  name: string;
  label: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  initialValue?: number;
  disabled?: boolean;
  withInput?: boolean;
  onChange?: (value: number) => void;
  register?: any;
  markersShow?: boolean;
};

export const RangeSlider: FC<RangeSliderProps> = ({
  name,
  label,
  className,
  min = 0,
  max = 100,
  defaultValue = min,
  initialValue = defaultValue,
  step = 1,
  disabled = false,
  withInput = false,
  markersShow = false,
  onChange,
  register,
}) => {
  const [rangeValue, setRangeValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState<number | string>(rangeValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeRange = useCallback(
    (value: number) => {
      setInputValue(value);
      setRangeValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  const handleChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      const value = Number(event.target.value);

      if (!Number.isNaN(value)) {
        setRangeValue(value > max ? max : value);
      }
    },
    [setInputValue, max],
  );

  const handleChangeBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const value = Number(event.target.value);

      if (Number.isNaN(value) || value < min) {
        handleChangeRange(min);
        return;
      }

      if (value > max) {
        handleChangeRange(max);
        return;
      }

      handleChangeRange(value);
    },
    [max, min, handleChangeRange],
  );

  const markers = useMemo(() => markersShow && Array(Math.round(max / step)).fill('x'), [
    markersShow,
    max,
    step,
  ]);

  const classValues = {
    root: cn(st.root, className),
    rangeMin: cn(st.rangeValue, rangeValue === min && st.rangeValueCurrent),
    rangeMax: cn(st.rangeValue, rangeValue === max && st.rangeValueCurrent),
    rangeCurrent: cn(st.rangeValue, st.rangeValueCurrent, st.rangeValueHandle),
  };

  return (
    <div className={classValues.root}>
      <div className={st.sliderWrapper}>
        <Typography variant="text130" color="secondaryDarkBlue910">
          {label}
        </Typography>
        <div className={st.rangeValuesWrapper}>
          <Typography
            className={classValues.rangeMin}
            variant="text110"
            onClick={() => handleChangeRange(min)}
          >
            {min}
          </Typography>
          <Typography
            className={classValues.rangeMax}
            variant="text110"
            onClick={() => handleChangeRange(max)}
          >
            {max}
          </Typography>
        </div>
        <SliderInput
          className={st.sliderInput}
          onChange={handleChangeRange}
          value={rangeValue}
          min={min}
          max={max}
          defaultValue={defaultValue}
          step={step}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <SliderTrack className={st.sliderTrack}>
            <SliderTrackHighlight className={st.sliderTrackHighlight} />
            <SliderHandle
              tabIndex={-1}
              className={st.sliderHandle}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {rangeValue !== min && rangeValue !== max && (
                <Typography
                  className={classValues.rangeCurrent}
                  variant="text110"
                  color="primaryBlue900"
                >
                  {rangeValue}
                </Typography>
              )}
            </SliderHandle>
            {markers &&
              markers.map((_, i) => (
                <SliderMarker key={i} className={st.sliderMarker} value={i + 1} />
              ))}
          </SliderTrack>
        </SliderInput>
      </div>
      {withInput && (
        <div className={st.inputWrapper}>
          <input
            className="hidden"
            type="number"
            name={name}
            value={inputValue}
            disabled={disabled}
            ref={register && register({ required: true, min, max })}
          />
          <Input
            className={st.input}
            type="number"
            step={step}
            value={inputValue}
            disabled={disabled}
            onChange={handleChangeInput}
            onBlur={handleChangeBlur}
            onFocus={() => setIsFocused(true)}
          />
          {rangeValue !== defaultValue && (
            <button
              tabIndex={-1}
              type="button"
              className={st.refreshButton}
              onClick={() => handleChangeRange(defaultValue)}
            >
              <Icon
                name="refresh"
                size={16}
                iconFill={isFocused ? 'primaryBlue900' : 'secondaryDarkBlue920'}
                style={{ transition: 'fill ease-in-out 0.3s' }}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
