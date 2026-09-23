"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
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

function formatSessionDate(date: Date) {
  return new Date(date).toLocaleDateString("ca-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SessionsClient({
  sessions,
  participants,
  isAdmin,
  activeSeasonName,
  seasonSelection,
}: {
  sessions: Session[];
  participants: Participant[];
  isAdmin: boolean;
  activeSeasonName: string;
  seasonSelection: number | "all";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [date, setDate] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || selectedParticipants.length === 0) return;
    setFormError(null);

    startTransition(async () => {
      const result = editSession
        ? await updateSession(editSession.id, new Date(date), selectedParticipants)
        : await createSession(new Date(date), selectedParticipants);
      if (!result.success) {
        setFormError(result.error ?? "No s'ha pogut desar la sessió.");
        return;
      }

      const createdSeasonId =
        result.success && "session" in result
          ? result.session?.seasonId
          : undefined;
      setOpen(false);
      setDate("");
      setSelectedParticipants([]);
      setEditSession(null);

      if (
        !editSession &&
        createdSeasonId !== undefined &&
        seasonSelection !== "all" &&
        seasonSelection !== createdSeasonId
      ) {
        router.replace(`/sessions?season=${createdSeasonId}`, { scroll: false });
      }
    });
  };

  const handleEdit = (s: Session) => {
    setEditSession(s);
    setDate(new Date(s.date).toISOString().split("T")[0]);
    setSelectedParticipants(s.participants.map((p) => p.id));
    setOpen(true);
  };

  const handleDelete = () => {
    if (!sessionToDelete) return;

    startTransition(async () => {
      await deleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    });
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
                setFormError(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Registra una sessió
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editSession ? "Edita la sessió" : "Registra una sessió"}
                </DialogTitle>
                {!editSession && (
                  <DialogDescription>
                    S’afegirà a {activeSeasonName} amb el número global següent.
                  </DialogDescription>
                )}
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
                  {formError && (
                    <p role="alert" className="text-xs font-medium text-destructive">
                      {formError}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending || selectedParticipants.length === 0}
                  >
                    {isPending ? "Registrant..." : "Confirma la sessió"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {sessions.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Encara no s’ha registrat cap sessió.
          </div>
        ) : (
          sessions.map((s) => (
            <article
              key={s.id}
              className="rounded-xl border bg-card p-4"
              aria-label={`Sessió S-${s.sessionNumber}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-primary">S-{s.sessionNumber}</h2>
                  <time
                    className="mt-1 block text-sm text-muted-foreground"
                    dateTime={new Date(s.date).toISOString()}
                  >
                    {formatSessionDate(s.date)}
                  </time>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => handleEdit(s)}
                      aria-label={`Edita la sessió S-${s.sessionNumber}`}
                      title={`Edita la sessió S-${s.sessionNumber}`}
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setSessionToDelete(s)}
                      aria-label={`Elimina la sessió S-${s.sessionNumber}`}
                      title={`Elimina la sessió S-${s.sessionNumber}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4 border-t pt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Assistents ({s.participants.length})
                </p>
                {s.participants.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {s.participants.map((p) => (
                      <Badge key={p.id} variant="secondary">
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Cap assistent registrat.</p>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
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
                  Encara no s’han registrat sessions.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-primary">
                    S-{s.sessionNumber}
                  </TableCell>
                  <TableCell>
                    <time dateTime={new Date(s.date).toISOString()}>
                      {formatSessionDate(s.date)}
                    </time>
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
                          aria-label={`Edita la sessió S-${s.sessionNumber}`}
                          title={`Edita la sessió S-${s.sessionNumber}`}
                        >
                          <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setSessionToDelete(s)}
                          aria-label={`Elimina la sessió S-${s.sessionNumber}`}
                          title={`Elimina la sessió S-${s.sessionNumber}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
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

      <ConfirmationDialog
        open={sessionToDelete !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isPending) setSessionToDelete(null);
        }}
        title={
          sessionToDelete
            ? `Elimina la sessió S-${sessionToDelete.sessionNumber}?`
            : "Elimina la sessió?"
        }
        description="La sessió i la seva llista d’assistents s’eliminaran definitivament."
        confirmLabel="Elimina la sessió"
        isPending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
