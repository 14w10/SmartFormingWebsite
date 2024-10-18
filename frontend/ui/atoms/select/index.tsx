import React, { FC, useRef } from 'react';
import cn from 'clsx';
import { useSelect } from 'downshift';

import { Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = {
  caption?: string;
  className?: string;
  items: SelectItem[];
  label?: string;
  onChange?: (value: string) => void;
  defaultSelectedItem?: SelectItem;
  variant?: 'default' | 'light' | 'noBorderLight';
  disabled?: boolean;
  value?: string;
};

export const Select: FC<SelectProps> = ({
  variant = 'default',
  className,
  caption,
  label = 'Select',
  defaultSelectedItem,
  onChange,
  items,
  disabled,
  value,
}) => {
  const menuRef = useRef(null);
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: items.find(item => item.value === value),
    onSelectedItemChange: ({ selectedItem }) => {
      if (onChange && selectedItem) {
        onChange(selectedItem.value);
      }
    },
    items,
  });

  const classValues = {
    root: cn(st[variant], className),
    list: cn(st[`${variant}List`], !isOpen && st.listClosed),
  };

  return (
    <>
      {caption && (
        <Typography as="label" variant="text130" color="secondaryDarkBlue910" mb="4px">
          {caption}
        </Typography>
      )}
      <div className={classValues.root}>
        <button
          type="button"
          className={cn(st.current, st[variant])}
          {...getToggleButtonProps({ disabled })}
        >
          {selectedItem?.label || label}
          <Icon className={st.icon} name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} />
        </button>
        <ul
        className={classValues.list}
        {...getMenuProps({ refKey: 'ref' })}
        ref={menuRef}
        >
          {items.map((item, index) => (
            <li
              className={cn(
                st.listItem,
                highlightedIndex === index && st.ListItemHighlighted,
                selectedItem === item && st.ListItemSelected,
              )}
              key={index}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
