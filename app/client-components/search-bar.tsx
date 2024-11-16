import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative flex-1">
      <Input
        placeholder="Type to start searching..."
        className="pl-4 pr-10 h-12"
      />
      <Button
        size="icon"
        className="absolute right-1 top-1 h-10 w-10"
        variant="ghost"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
