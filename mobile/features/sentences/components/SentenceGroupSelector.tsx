import { useMemo } from 'react';
import { t } from '@/global/i18n/t';
import { useSentenceStore } from '@/features/sentences/stores/sentence.store';
import { ItemDropdown } from '@/global/components/ItemDropdown';
import { getSentenceCountByGroup } from '@/features/sentences/sentence.service';

const ALL_GROUP_ID = '__all__';

export function SentenceGroupSelector() {
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const groups = useSentenceStore((s) => s.groups);
  const selectGroup = useSentenceStore.getState().selectGroup;
  const sentences = useSentenceStore((s) => s.sentences);

  /** Calculate sentence counts by group */
  const countByGroup: Record<string, number> = useMemo(
    () => getSentenceCountByGroup(sentences),
    [sentences]
  );

  const displayedGroups = useMemo(
    () => [
      {
        label: `${t('sentenceGroups.allGroups')} (${sentences.length})`,
        value: ALL_GROUP_ID,
      },
      ...groups.map((group) => ({
        label: `${group.name} (${countByGroup[group.id] || 0})`,
        value: group.id,
      })),
    ],
    [groups, sentences.length, countByGroup]
  );

  function handleChange(value: string | null) {
    if (value === ALL_GROUP_ID) {
      selectGroup(null);
    } else {
      selectGroup(value);
    }
  }

  return (
    <ItemDropdown
      data={displayedGroups}
      value={currentGroupId ?? ALL_GROUP_ID}
      onChange={handleChange}
    />
  );
}
