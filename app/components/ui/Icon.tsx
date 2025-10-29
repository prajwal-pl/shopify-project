import { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { ICON_SIZES, IconSize } from '~/utils/icons';

interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon;
  size?: IconSize | number;
  strokeWidth?: number;
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  strokeWidth = 2,
  className,
  ...props
}: IconProps) {
  const sizeValue = typeof size === 'number' ? size : ICON_SIZES[size];

  return (
    <IconComponent
      size={sizeValue}
      strokeWidth={strokeWidth}
      className={cn('inline-block flex-shrink-0', className)}
      {...props}
    />
  );
}
