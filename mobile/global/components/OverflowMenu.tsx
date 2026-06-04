import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

type OverflowMenuProps = {
  items: {
    key: string;
    onSelect: () => void;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  menuDisabled?: boolean; // Optional prop to disable the entire menu when true
  separatorIndexes?: number[]; // Optional indexes where separators should be rendered under options of these indices
};

const optionsStyle = {
  optionsContainer: {
    marginTop: 30,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: '#a7f3d0',
    elevation: 4, // Android shadow
  },
};

const optionStyle = {
  optionWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#1064d9',
  },
};

export function OverflowMenu({
  items,
  menuDisabled = false,
  separatorIndexes = [],
}: OverflowMenuProps) {
  return (
    <Menu>
      <MenuTrigger disabled={menuDisabled}>
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={menuDisabled ? '#94a3b8' : '#334155'}
          // className="border-xl"
        />
      </MenuTrigger>

      <MenuOptions customStyles={optionsStyle}>
        {items.map((item, index) => (
          <Fragment key={item.key}>
            <MenuOption
              onSelect={item.onSelect}
              customStyles={optionStyle}
              disabled={item.disabled ?? false}
            >
              {item.content}
            </MenuOption>

            {/* Separator */}
            {separatorIndexes.includes(index) && (
              <View className="h-px bg-slate-400 mx-3" />
            )}
          </Fragment>
        ))}
      </MenuOptions>
    </Menu>
  );
}
