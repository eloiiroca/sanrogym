"use client";

import { useState, useTransition } from "react";
import {
  createSession,
  updateSession,
  deleteSession,
} from "@/app/actions/sessions";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Plus, Dumbbell, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Participant {
  id: string;
  name: string;
}

interface Session {
  id: string;
  sessionNumber: number;
  date: Date;
  participants: Participant[];
}

export function SessionsClient({
  sessions,
  participants,
  isAdmin,
}: {
  sessions: Session[];
  participants: Participant[];
  isAdmin: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [date, setDate] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || selectedParticipants.length === 0) return;

    startTransition(async () => {
      if (editSession) {
        await updateSession(editSession.id, new Date(date), selectedParticipants);
      } else {
        await createSession(new Date(date), selectedParticipants);
      }
      setOpen(false);
      setDate("");
      setSelectedParticipants([]);
      setEditSession(null);
    });
  };

  const handleEdit = (s: Session) => {
    setEditSession(s);
    setDate(new Date(s.date).toISOString().split("T")[0]);
    setSelectedParticipants(s.participants.map((p) => p.id));
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Segur que vols eliminar aquesta sessió?")) {
      startTransition(async () => {
        await deleteSession(id);
      });
    }
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        </div>
        {isAdmin && (
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) {
                setEditSession(null);
                setDate("");
                setSelectedParticipants([]);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Sessió
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editSession ? "Editar Sessió" : "Registrar Nova Sessió"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Assistents</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`p-${p.id}`}
                          checked={selectedParticipants.includes(p.id)}
                          onCheckedChange={() => toggleParticipant(p.id)}
                        />
                        <Label
                          htmlFor={`p-${p.id}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {p.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedParticipants.length === 0 && (
                    <p className="text-xs text-destructive">
                      Selecciona almenys un assistent
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending || selectedParticipants.length === 0}
                  >
                    {isPending ? "Registrant..." : "Confirmar Sessió"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Assistents</TableHead>
              {isAdmin && <TableHead className="text-right">Accions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 4 : 3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Encara no s'han registrat sessions.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-primary">
                    S-{s.sessionNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(s.date).toLocaleDateString("ca-ES", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.participants.map((p) => (
                        <Badge key={p.id} variant="secondary">
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(s)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
