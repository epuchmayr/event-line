
// SHADCN COMPONENTS
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils"

export default function Tags ({ className, tags }: { className?: string; tags: string }) {
  return (
    <div className={cn(className)}>
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