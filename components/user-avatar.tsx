import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string;
    className?: string;
};

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
  let imageUrl: string | undefined = undefined;

  try {
    if (src?.startsWith("{")) {
      const parsed = JSON.parse(src);
      imageUrl = parsed.url;
    } else {
      imageUrl = src;
    }
  } catch {
    imageUrl = src;
  }

  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={imageUrl} />
    </Avatar>
  );
};