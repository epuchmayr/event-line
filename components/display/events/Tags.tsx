
// SHADCN COMPONENTS
import { Badge } from '@/components/ui/badge';

export default function Tags ({ tags }: { tags: string }) {
  return (
    <div>
      {JSON.parse(tags).map((tag: { label: string; value: string }) => {
        return (
          <Badge key={tag.value} className='mr-1'>
            {tag.label}
          </Badge>
        );
      })}
    </div>
  );
};