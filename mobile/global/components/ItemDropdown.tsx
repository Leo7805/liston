import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';

type ItemDropdownProps = {
  data: { label: string; value: string }[]; // Array of items to display in the dropdown, each with a label and value
  value: string; // The currently selected value in the dropdown
  onChange: (value: string) => void; // Callback function to handle when the selected value changes
  hasRightIcon?: boolean; // Optional prop to determine if a right icon should be displayed
  disabled?: boolean; // Optional prop to determine if the dropdown should be disabled
};

export function ItemDropdown({
  data,
  value,
  onChange,
  hasRightIcon = true,
}: ItemDropdownProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      value={value}
      activeColor="rgba(15, 23, 42, 0.18)"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(item) => {
        onChange(item.value);
        setIsFocused(false);
      }}
      renderRightIcon={
        hasRightIcon
          ? () => (
              <Ionicons
                name={isFocused ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="darkslategray"
              />
            )
          : undefined
      }
      selectedTextProps={{
        numberOfLines: 1,
        ellipsizeMode: 'tail',
      }}
      style={{
        height: 42,
        width: 115,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: isFocused
          ? 'rgba(60,58, 58, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
      }}
      selectedTextStyle={{
        color: 'darkslategray',
        fontSize: 13,
        fontWeight: '400',
      }}
      containerStyle={{
        maxHeight: 230,
        borderRadius: 13,
        backgroundColor: '#a7f3d0', // emerald-200

        borderWidth: 0,
      }}
      itemContainerStyle={{
        borderRadius: 12, //  Add rounded corners to each item
        overflow: 'hidden', // Ensure the background color is clipped to the rounded corners
      }}
      placeholderStyle={{
        color: 'darkslategray',
        fontSize: 13,
      }}
      itemTextStyle={{
        color: '#0f172a',
        fontSize: 13,
      }}
    ></Dropdown>
  );
}
