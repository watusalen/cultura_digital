import type { Unidade } from "../models";
import { Button } from "../../../shared/components/Button";

type UnidadeCardProps = {
  unidade: Unidade;
  onSelect: (unidade: Unidade) => void;
  onDelete: (id: string) => void;
};

export function UnidadeCard({ unidade, onSelect, onDelete }: UnidadeCardProps) {
  return (
    <article className="surface-variant padding rounded row align-center mb-2">
      <div className="max">
        <div className="row align-center">
          <h6 className="no-margin bold">{unidade.nome}</h6>
          {unidade.origem === "ia" && (
            <span className="chip purple small-margin-left small">IA</span>
          )}
        </div>
        {unidade.descricao && <p className="small-text no-margin">{unidade.descricao}</p>}
      </div>
      <nav className="row no-margin">
        <Button 
          variant="border" 
          onClick={() => onSelect(unidade)}
          icon="folder_open"
        >
          Materiais
        </Button>
        <Button 
          variant="transparent" 
          className="text-error" 
          onClick={() => onDelete(unidade.id)}
          icon="delete"
        />
      </nav>
    </article>
  );
}