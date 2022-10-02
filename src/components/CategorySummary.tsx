import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../hooks';
import { selectCategoryArrayByIds } from '../slices/categorySlice';
import { selectUserItems } from '../slices/userItemSlice';
import { Category, UserItem, UUID } from '../types';

interface SummaryEntry {
  name?: string
  weight: number
  color: string
};

interface CustomLegendPayload {
  value: any
  color?: string
  weight: number
}

// https://www.learnui.design/tools/data-color-picker.html#palette
const COLORS = [
  '#0037c2',
  '#891fb5',
  '#c4009e',
  '#ec0082',
  '#ff2064',
  '#ff5446',
  '#ff7f28',
  '#ffa600'
];
const createSummaryEntries = (
  categories: Category[],
  userItemsById: { [id: UUID]: UserItem }
): SummaryEntry[] => {
  const categoryWeights = categories.map(category => {
    const totalWeight = category.items.reduce(
      (sum, item) => sum + (userItemsById[item.userItemId].weight ?? 0) * item.quantity,
      0
    );
    return { name: category.name, weight: totalWeight };
  });
  const categoryWeightsWithColors = categoryWeights.map((entry, index) => {
    return { ...entry, color: COLORS[index % COLORS.length] };
  });
  return categoryWeightsWithColors;
};

const CategorySummary = ({ categoryIds }: { categoryIds: UUID[] }) => {
  const categories = useAppSelector(state => selectCategoryArrayByIds(state, categoryIds));
  const userItems = useAppSelector(selectUserItems);

  const summaryEntries = createSummaryEntries(categories, userItems);

  const renderLegend = ({ payload }: { payload: CustomLegendPayload[] }) => {
    return (
      <ul className="summary-legend">
        {payload.map((entry, index) => {
          return (
            <li key={`legend-item-${index}`}>
              <span>{entry.value} {entry.weight} g</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="75%" height={400}>
        <PieChart>
          <Pie
            data={summaryEntries}
            isAnimationActive={false}
            nameKey="name"
            dataKey="weight"
            label={(entry) => entry.name}
            labelLine={false}
          >
            {summaryEntries.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            payload={summaryEntries.map(
              (entry, _index) => ({
                value: entry.name,
                weight: entry.weight,
                color: entry.color
              })
            )}
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategorySummary;
