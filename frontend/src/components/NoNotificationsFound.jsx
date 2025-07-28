import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-base-300 mb-4 flex items-center justify-center">
            <BellIcon className="size-8 text-base-content opacity-70" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Notifications Found</h3>
        <p className="text-base-content opacity-70 max-w-md">
            When you receive notifications, they will appear here to keep you updated on your language learning journey.
        </p>
    </div>
  );
}

export default NoNotificationsFound;
