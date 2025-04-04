import React from "react";

type IconWithTooltipProps = {
    icon: React.ElementType;
    tooltip: string;
    size?: number;
    className?: string;
};

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
    icon: Icon,
    tooltip,
    ...props
}) => (
    <div className="relative group">
        <Icon {...props} />
        <div className="absolute z-10 hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 -mt-1 left-full ml-2 w-48">
            {tooltip}
        </div>
    </div>
);

export default IconWithTooltip;