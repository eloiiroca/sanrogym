"use client";

import { useState, useTransition } from "react";
import {
  activateSeason,
  createSeason,
  deleteSeason,
  updateSeasonName,
} from "@/app/actions/seasons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarRange, Edit2, Plus, Trash2 } from "lucide-react";
import type { SeasonOption } from "@/lib/season-types";

export function SeasonsManager({ seasons }: { seasons: SeasonOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [editingSeason, setEditingSeason] = useState<SeasonOption | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<SeasonOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createSeason(name);
      if (!result.success) {
        setError(result.error ?? "No s'ha pogut crear la temporada.");
        return;
      }
      setName("");
    });
  };

  const handleUpdateName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSeason) return;
    setError(null);

    startTransition(async () => {
      const result = await updateSeasonName(editingSeason.id, editingName);
      if (!result.success) {
        setError(result.error ?? "No s'ha pogut actualitzar el nom.");
        return;
      }
      setEditOpen(false);
      setEditingSeason(null);
    });
  };

  const handleActivate = (id: number) => {
    setError(null);
    startTransition(async () => {
      const result = await activateSeason(id);
      if (!result.success) {
        setError(result.error ?? "No s'ha pogut activar la temporada.");
      }
    });
  };

  const handleDelete = () => {
    if (!seasonToDelete) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteSeason(seasonToDelete.id);
      if (!result.success) {
        setError(result.error ?? "No s'ha pogut eliminar la temporada.");
        return;
      }
      setSeasonToDelete(null);
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <CalendarRange className="mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Temporades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organitza l’historial del Sanrogym i tria quina temporada és activa.
          </p>
        </div>
      </header>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-season-name">Nom de la temporada</Label>
            <Input
              id="new-season-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Per exemple, Temporada 3"
              maxLength={80}
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crea una temporada
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Les temporades noves es creen inactives; l’actual continua activa fins que n’activis una altra.
        </p>
      </Card>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {seasons.map((season) => {
          const cannotDelete = season.isActive || season.sessionCount > 0;
          const sessionLabel = season.sessionCount === 1 ? "sessió" : "sessions";

          return (
            <Card key={season.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{season.name}</h2>
                    <Badge
                      variant={season.isActive ? "default" : "secondary"}
                      className={season.isActive ? "bg-primary text-primary-foreground" : ""}
                    >
                      {season.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {season.sessionCount} {sessionLabel}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!season.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleActivate(season.id)}
                    >
                      Activa
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    disabled={isPending}
                    onClick={() => {
                      setEditingSeason(season);
                      setEditingName(season.name);
                      setEditOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                    Canvia el nom
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={isPending || cannotDelete}
                    onClick={() => setSeasonToDelete(season)}
                    aria-label={`Elimina ${season.name}`}
                    title={
                      season.isActive
                        ? "No es pot eliminar la temporada activa"
                        : season.sessionCount > 0
                          ? "No es pot eliminar una temporada amb sessions"
                          : `Elimina ${season.name}`
                    }
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(nextOpen) => {
          setEditOpen(nextOpen);
          if (!nextOpen) setEditingSeason(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Canvia el nom de la temporada</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateName} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-season-name">Nom</Label>
              <Input
                id="edit-season-name"
                value={editingName}
                onChange={(event) => setEditingName(event.target.value)}
                maxLength={80}
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Desant..." : "Desa el nom"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={seasonToDelete !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isPending) setSeasonToDelete(null);
        }}
        title="Vols eliminar la temporada?"
        description={
          seasonToDelete
            ? `S’eliminarà ${seasonToDelete.name}. Aquesta acció no es pot desfer.`
            : ""
        }
        confirmLabel="Elimina la temporada"
        isPending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
