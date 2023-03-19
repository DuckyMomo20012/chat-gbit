import { Table } from '@mantine/core';
import { TModel } from '@/store/slice/modelSlice';

const PriceTable = ({ model }: { model: TModel }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Model</th>
          <td>{model.name}</td>
        </tr>
        <tr>
          <th>Prompt</th>
          <td>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 4,
            }).format(model.price.prompt)}
            /
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(model.per)}{' '}
            tokens
          </td>
        </tr>
        <tr>
          <th>Completion</th>
          <td>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 4,
            }).format(model.price.completion)}
            /
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(model.per)}{' '}
            tokens
          </td>
        </tr>
      </thead>
    </Table>
  );
};

export { PriceTable };
