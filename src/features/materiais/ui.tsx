import type { Unidade } from "../unidades/models";
import type { Disciplina } from "../disciplinas/models";
import { PageHeader } from "../../shared/components/PageHeader";
import { PlanoAulaCard } from "./components/PlanoAulaCard";
import { AtividadeCard } from "./components/AtividadeCard";
import { SlidesCard } from "./components/SlidesCard";

type MateriaisPageProps = {
  disciplina: Disciplina;
  unidade: Unidade;
  onVoltar: () => void;
};

export default function MateriaisPage({ disciplina, unidade, onVoltar }: MateriaisPageProps) {
  return (
    <main className="responsive">
      <PageHeader
        title={`Materiais - ${unidade.nome}`}
        subtitle={`${disciplina.nome} • ${disciplina.serieAno}`}
        onBack={onVoltar}
        backLabel="Voltar para Unidades"
      />

      <div className="grid">
        <div className="s12">
          <PlanoAulaCard unidade={unidade} disciplina={disciplina} />
        </div>

        <div className="s12">
          <AtividadeCard unidade={unidade} disciplina={disciplina} />
        </div>

        <div className="s12">
          <SlidesCard unidade={unidade} />
        </div>
      </div>
    </main>
  );
}
