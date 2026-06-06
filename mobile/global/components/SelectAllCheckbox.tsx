import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

/** Three-state selection status */
export const selectAllState = {
  ALL: 'all',
  NONE: 'none',
  PARTIAL: 'partial',
};

export type SelectAllState =
  (typeof selectAllState)[keyof typeof selectAllState];

type SelectAllCheckboxProps = {
  selectedCount: number;
  visibleCount: number;
  onToggle: () => void;
};

export function SelectAllCheckbox({
  selectedCount,
  visibleCount,
  onToggle,
}: SelectAllCheckboxProps) {
  /* Determine the "Select All" icon state based on the number of selected sentences and visible sentences */
  function getSelectAllIconState(): SelectAllState {
    if (selectedCount === 0) return selectAllState.NONE;

    if (selectedCount === visibleCount) return selectAllState.ALL;

    return selectAllState.PARTIAL;
  }

  /* Get the appropriate icon name for the "Select All" button based on the current selection state */
  function getSelectAllIconName() {
    const state = getSelectAllIconState();

    if (state === selectAllState.ALL) return 'checkbox';
    if (state === selectAllState.PARTIAL) return 'checkbox-outline';

    return 'square-outline';
  }

  return (
    <View className="flex-1 flex-row items-center p-2">
      {/* Select All checkbox */}
      <TouchableOpacity
        onPress={onToggle}
        className="h-10 flex-row items-center justify-center pl-2"
      >
        <Ionicons name={getSelectAllIconName()} size={23} color="#334155" />
        <View className="flex-row items-center">
          <Text className="text-zinc-700">Select All</Text>
          <Text className=" text-slate-500 ml-1">({selectedCount})</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
