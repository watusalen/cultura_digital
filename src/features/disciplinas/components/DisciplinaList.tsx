import type { Disciplina } from "../models";
import { DisciplinaCard } from "./DisciplinaCard";
import { EmptyState } from "../../../shared/components/EmptyState";

type DisciplinaListProps = {
  disciplinas: Disciplina[];
  onSelectDisciplina?: (disciplina: Disciplina) => void;
  onDeleteDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinaList({ disciplinas, onSelectDisciplina, onDeleteDisciplina }: DisciplinaListProps) {
  if (disciplinas.length === 0) {
    return (
      <EmptyState
        icon="school"
        title="Nenhuma disciplina encontrada"
        description="Clique em 'Criar disciplina' para começar."
      />
    );
  }

  return (
    <div className="grid">
      {disciplinas.map((disciplina) => (
        <div key={disciplina.id} className="s12 m6 l4">
          <DisciplinaCard
            disciplina={disciplina}
            onSelect={onSelectDisciplina}
            onDelete={onDeleteDisciplina}
          />
        </div>
      ))}
    </div>
  );
}

