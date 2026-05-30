import { useSentenceStore } from '@/features/sentences/sentence.store';
import { HeaderDropdown } from '@/global/components/HeaderDropdown';
import { t } from '@/global/i18n/t';
import { useMemo } from 'react';

const ALL_GROUP_ID = '__all__';

export function SentenceGroupSelector() {
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const groups = useSentenceStore((s) => s.groups);
  const selectGroup = useSentenceStore.getState().selectGroup;

  const displayedGroups = useMemo(
    () => [
      { label: t('sentenceGroups.allGroups'), value: ALL_GROUP_ID },
      ...groups.map((group) => ({ label: group.name, value: group.id })),
    ],
    [groups]
  );

  function handleChange(value: string | null) {
    if (value === ALL_GROUP_ID) {
      selectGroup(null);
    } else {
      selectGroup(value);
    }
  }

  return (
    <HeaderDropdown
      data={displayedGroups}
      value={currentGroupId ?? ALL_GROUP_ID}
      onChange={handleChange}
    />
  );
}
