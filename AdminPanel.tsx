import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AdminPanelProps {
  availableThreads: string[];
  activeThread: string;
  onThreadChange: (thread: string) => void;
  onDeleteThread: (thread: string) => void;
}

export function AdminPanel({ availableThreads, activeThread, onThreadChange, onDeleteThread }: AdminPanelProps) {
  const handleDeleteThread = () => {
    if (!activeThread) return;
    
    const confirmDelete = window.confirm(`Opravdu chcete smazat chat "${activeThread.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}" a celou jeho historii?`);
    if (confirmDelete) {
      onDeleteThread(activeThread);
    }
  };
  return (
    <div className="mb-4 p-3 bg-visiblo-surface rounded-xl border border-visiblo-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <span className="text-visiblo-text font-semibold">Správce:</span>
        <label htmlFor="userSelect" className="text-visiblo-text font-medium">
          Vyberte uživatele:
        </label>
        <div className="flex items-center gap-2 flex-1">
          {availableThreads.length > 0 ? (
            <>
              <Select value={activeThread || ""} onValueChange={onThreadChange}>
                <SelectTrigger className="w-full sm:w-48 px-3 py-2 border-2 border-visiblo-border rounded-lg bg-white focus:border-visiblo-primary-dark focus:bg-visiblo-bg-lighter transition-all duration-300">
                  <SelectValue placeholder="Vyberte vlákno" />
                </SelectTrigger>
                <SelectContent>
                  {availableThreads.map((thread) => (
                    <SelectItem key={thread} value={thread}>
                      {thread.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeThread && (
                <Button
                  onClick={handleDeleteThread}
                  variant="destructive"
                  size="sm"
                  className="px-3 py-2 h-auto"
                  title="Smazat chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </>
          ) : (
            <div className="w-full sm:w-48 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg">
              Žádná vlákna k zobrazení
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
