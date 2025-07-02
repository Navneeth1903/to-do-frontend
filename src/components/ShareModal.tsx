import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TaskWithDetails } from "../lib/schema";
import { Link, Trash2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithDetails | null;
}

export function ShareModal({ isOpen, onClose, task }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const shareTask = useMutation({
    mutationFn: async (email: string) => {
      await fetch(`/api/tasks/${task!.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, permission: 'edit' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast.success('Task shared successfully');
      setEmail('');
    },
    onError: () => {
      toast.error('Failed to share task');
    }
  });

  const unshareTask = useMutation({
    mutationFn: async (userId: string) => {
      await fetch(`/api/tasks/${task!.id}/share/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast.success('Task access removed');
    },
    onError: () => {
      toast.error('Failed to remove access');
    }
  });

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    shareTask.mutate(email.trim());
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/tasks/${task?.id}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleShare}>
            <Label htmlFor="email">Invite by Email</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1"
              />
              <Button type="submit" disabled={shareTask.isPending}>
                {shareTask.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
          
          {task.collaborators.length > 0 && (
            <div>
              <Label>Current Collaborators</Label>
              <div className="space-y-2 mt-2">
                {task.collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 mr-3">
                        <AvatarImage src={collab.user.profileImageUrl || ''} />
                        <AvatarFallback>
                          {collab.user.firstName?.charAt(0) || collab.user.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {collab.user.firstName && collab.user.lastName 
                            ? `${collab.user.firstName} ${collab.user.lastName}`
                            : collab.user.email}
                        </p>
                        <p className="text-xs text-slate-500">{collab.user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unshareTask.mutate(collab.userId)}
                      className="text-red-500 hover:text-red-700"
                      disabled={unshareTask.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
