"use client";

import { useState, useTransition } from "react";
import {
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from "@/app/actions/participants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Trash2, Plus, Users } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  createdAt: Date;
  sessions: { id: string }[];
}

export function RosterClient({
  participants,
}: {
  participants: Participant[];
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editParticipant, setEditParticipant] = useState<Participant | null>(
    null
  );
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      if (editParticipant) {
        await updateParticipant(editParticipant.id, name);
      } else {
        await createParticipant(name);
      }
      setOpen(false);
      setName("");
      setEditParticipant(null);
    });
  };

  const handleEdit = (p: Participant) => {
    setEditParticipant(p);
    setName(p.name);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this participant?")) {
      startTransition(async () => {
        await deleteParticipant(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Roster</h1>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditParticipant(null);
              setName("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editParticipant ? "Edit Participant" : "Add New Participant"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Total Sessions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No participants found. Add your first friend!
                </TableCell>
              </TableRow>
            ) : (
              participants.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-center">
                    {p.sessions.length}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(p)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
