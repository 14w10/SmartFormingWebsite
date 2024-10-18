import React, { memo, ReactNode, useCallback, useMemo } from 'react';
import cn from 'clsx';
import { useSelect } from 'downshift';
import { isEqual } from 'lodash';

import { Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type ItemProps = {
  option: ReactNode;
  value: string | number;
};

type DropDownSelectProps = {
  as?: string;
  className?: string;
  variant?: 'solid' | 'separate';
  menuLabel?: ItemProps;
  items?: ItemProps[];
  defaultValue?: ItemProps;
  direction?: 'down' | 'up';
  onSelect?: (value: number | string | ItemProps, i?: number) => void;
  width?: number | string;
  borderRadius?: number | string;
} & Record<string, any>;

export const DropdownSelect = memo(
  ({
    menuLabel,
    className,
    items = [],
    variant = 'solid',
    direction = 'down',
    onSelect,
    defaultValue,
    width = 'auto',
    borderRadius,
  }: DropDownSelectProps) => {
    const {
      isOpen,
      selectedItem,
      getToggleButtonProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      items: items || [],
      onSelectedItemChange: item => {
        item?.selectedItem && onSelect?.(item?.selectedItem);
      },
      initialSelectedItem: defaultValue,
    });

    const isSolid = variant === 'solid';

    const selectedItemIndex = useMemo(() => {
      if (!selectedItem) return 0;

      let index = 0;

      items.map((item, i) => {
        if (isEqual(selectedItem, item)) index = i;
      });

      return index;
    }, [items, selectedItem]);

    const classValues = {
      wrapper: cn(st.wrapper, isSolid && st.wrapperBg),
      current: cn(st.current, isSolid && st.currentHover, menuLabel && st.noPadding),
      list: cn(
        st.list,
        isSolid && st.listSeparate,
        !isOpen && st.listClosed,
        direction == 'up' && st.listReversed,
      ),
      listItem: cn(st.listItem, menuLabel && st.noPadding),
    };

    const selectedItemColor = useMemo(() => {
      if (menuLabel) return 'secondaryDarkBlue920';

      return isSolid ? 'primaryBlue900' : isOpen ? 'secondaryDarkBlue910' : 'secondaryDarkBlue920';
    }, [isOpen, isSolid, menuLabel]);

    const iconName = useMemo(() => {
      if (direction === 'down') {
        return !isOpen ? 'arrow-drop-down' : 'arrow-drop-up';
      } else {
        return !isOpen ? 'arrow-drop-up' : 'arrow-drop-down';
      }
    }, [direction, isOpen]);
    const iconFill = useMemo(() => {
      if (menuLabel) return 'secondaryDarkBlue920';
      return isSolid ? 'primaryBlue900' : !isOpen ? 'secondaryDarkBlue920' : 'secondaryDarkBlue910';
    }, [menuLabel, isOpen, isSolid]);

    const borderRadiusStyle = useMemo(() => (borderRadius ? { borderRadius: borderRadius } : {}), [
      borderRadius,
    ]);

    const ArrowIcon = useCallback(
      () => <Icon name={iconName} size={24} iconFill={iconFill} mr={menuLabel && '12px'} />,
      [iconFill, iconName, menuLabel],
    );

    const SelectedItem = useCallback(
      () => (
        <>
          {menuLabel ? (
            <div className="text-secondaryDarkBlue920">{menuLabel.option}</div>
          ) : (
            <Typography
              as="div"
              variant={menuLabel ? 'h150' : isSolid ? 'button160' : 'text110'}
              color={selectedItemColor}
            >
              {selectedItem?.option || 'Select'}
            </Typography>
          )}
          <ArrowIcon />
        </>
      ),
      [ArrowIcon, isSolid, menuLabel, selectedItem?.option, selectedItemColor],
    );

    return (
      <div className={`select-none relative z-10 ${className ?? ''}`}>
        <div className={classValues.wrapper} style={borderRadiusStyle}>
          <button
            className={`${classValues.current} focus:outline-none`}
            {...getToggleButtonProps()}
            style={{ width }}
          >
            <SelectedItem />
          </button>
          {isOpen && (
            <ul className={classValues.list} style={borderRadiusStyle} {...getMenuProps()}>
              {items.map((item, i: number) => (
                <li
                  className={`${classValues.listItem} ${
                    selectedItemIndex === i && st.listItemSelected
                  } ${highlightedIndex === i && 'bg-primaryBlue900'}`}
                  key={i}
                  {...getItemProps({ item: item, index: i })}
                >
                  {menuLabel ? (
                    <div
                      className={`${
                        highlightedIndex === i ? 'text-white' : 'text-secondaryDarkBlue920'
                      }`}
                    >
                      {item.option}
                    </div>
                  ) : (
                    <Typography
                      as="div"
                      variant={isSolid ? 'button120' : 'text110'}
                      color={
                        menuLabel
                          ? 'secondaryDarkBlue920'
                          : highlightedIndex === i
                          ? 'white'
                          : selectedItemIndex === i
                          ? 'primaryBlue900'
                          : 'secondaryDarkBlue920'
                      }
                    >
                      {item.option}
                    </Typography>
                  )}
                  {menuLabel && i === 0 && <ArrowIcon />}
                </li>
              ))}
              {isSolid && !menuLabel && (
                <li
                  className={`${classValues.listItem} ${st.current}`}
                  {...getItemProps({ item: selectedItem || items[0], index: selectedItemIndex })}
                >
                  <SelectedItem />
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  },
);
