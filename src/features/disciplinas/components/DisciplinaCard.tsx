import type { Disciplina } from "../models";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";

type DisciplinaCardProps = {
  disciplina: Disciplina;
  onSelect?: (disciplina: Disciplina) => void;
  onDelete?: (disciplina: Disciplina) => void;
};

export function DisciplinaCard({ disciplina, onSelect, onDelete }: DisciplinaCardProps) {
  return (
    <Card 
      className="no-padding round cursor-pointer" 
      onClick={() => onSelect?.(disciplina)}
      actions={
        onDelete && (
          <Button 
            variant="transparent"
            className="circle text-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(disciplina);
            }}
            title="Excluir disciplina"
            icon="delete"
          />
        )
      }
    >
      <h5>{disciplina.nome}</h5>
      <div className="row gap">
        <div className="chip small">{disciplina.serieAno}</div>
        {disciplina.assunto && (
          <div className="chip small primary surface">{disciplina.assunto}</div>
        )}
      </div>
    </Card>
  );
}

