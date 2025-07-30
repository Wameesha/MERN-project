import {LoaderIcon} from "lucide-react";

function ChatLoader() {
 return (
    <div className="h-screen flex flex-col items-center justify-center p-4 ">
        <LoaderIcon className="animate-spin  size -10 text-primary " />
        <p className="text-lg text-center mt-4 font-mono">
            Connecting to chat ...
        </p>
    </div>
 );
}

export default ChatLoader;