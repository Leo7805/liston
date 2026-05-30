import { Dropdown } from 'react-native-element-dropdown';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type HeaderDropdownProps = {
  data: { label: string; value: string }[];
  value: string | null;
  onChange?: (value: string | null) => void;
};

export function HeaderDropdown({ data, value, onChange }: HeaderDropdownProps) {
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
        onChange?.(item.value);
        setIsFocused(false);
      }}
      renderRightIcon={() => (
        <Ionicons
          name={isFocused ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="white"
        />
      )}
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
        color: 'white',
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
        color: 'white',
        fontSize: 13,
      }}
      itemTextStyle={{
        color: '#0f172a',
        fontSize: 13,
      }}
    ></Dropdown>
  );
}
