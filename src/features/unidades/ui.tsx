import { useState } from "react";
import { listarUnidadesDaDisciplina, salvarUnidade, removerUnidade, gerarSugestaoUnidades } from "./services";
import type { Unidade } from "./models";
import { PageHeader } from "../../shared/components/PageHeader";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { Dialog } from "../../shared/components/Dialog";
import { Input, Textarea } from "../../shared/components/FormFields";
import { EmptyState } from "../../shared/components/EmptyState";
import { UnidadeCard } from "./components/UnidadeCard";

type UnidadesPageProps = {
  disciplina: { id: string; nome: string; serieAno: string };
  onVoltar: () => void;
  onSelecionarUnidade: (unidade: Unidade) => void;
};

export default function UnidadesPage({ disciplina, onVoltar, onSelecionarUnidade }: UnidadesPageProps) {
  const [unidades, setUnidades] = useState<Unidade[]>(listarUnidadesDaDisciplina(disciplina.id));
  const [criando, setCriando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleGerarSugestoes() {
    if (confirm("Isso usará IA para sugerir unidades com base na BNCC. Deseja continuar?")) {
      setGerando(true);
      try {
        const sugestoes = await gerarSugestaoUnidades({
          disciplina: disciplina.nome,
          serieAno: disciplina.serieAno,
        });

        for (const s of sugestoes) {
          const novaUnidade: Unidade = {
            id: crypto.randomUUID(),
            disciplinaId: disciplina.id,
            nome: s.nome,
            descricao: s.descricao,
            materiais: [],
            origem: "ia",
          };
          salvarUnidade(novaUnidade);
        }
        setUnidades(listarUnidadesDaDisciplina(disciplina.id));
      } catch (error) {
        alert("Erro ao gerar sugestões. Tente novamente.");
        console.error(error);
      } finally {
        setGerando(false);
      }
    }
  }

  function handleSalvar() {
    if (!nome.trim()) return;

    const novaUnidade: Unidade = {
      id: crypto.randomUUID(),
      disciplinaId: disciplina.id,
      nome: nome.trim(),
      descricao: descricao.trim(),
      materiais: [], // Inicialmente sem materiais
    };

    salvarUnidade(novaUnidade);
    setUnidades(listarUnidadesDaDisciplina(disciplina.id));
    setCriando(false);
    setNome("");
    setDescricao("");
  }

  function handleRemover(id: string) {
    if (confirm("Tem certeza que deseja remover esta unidade?")) {
      removerUnidade(id);
      setUnidades(listarUnidadesDaDisciplina(disciplina.id));
    }
  }

  return (
    <main className="responsive">
      <PageHeader
        title={`Unidades - ${disciplina.nome}`}
        subtitle={disciplina.serieAno}
        onBack={onVoltar}
        backLabel="Voltar para Disciplinas"
      />

      <Card
        title="Unidades de Ensino"
        icon="view_list"
        actions={
          !criando && (
            <>
              <Button 
                variant="border" 
                onClick={handleGerarSugestoes} 
                disabled={gerando} 
                loading={gerando}
                icon="auto_awesome"
                className="mr-2"
              >
                {gerando ? "Gerando..." : "Gerar com IA"}
              </Button>
              <Button onClick={() => setCriando(true)} icon="add">
                Nova Unidade
              </Button>
            </>
          )
        }
      >
        {unidades.length === 0 ? (
          <EmptyState
            title="Nenhuma unidade cadastrada"
            description="Cadastre uma unidade manualmente ou gere com IA."
          />
        ) : (
          <div className="grid">
            {unidades.map((unidade) => (
              <div key={unidade.id} className="s12">
                <UnidadeCard 
                  unidade={unidade}
                  onSelect={onSelecionarUnidade}
                  onDelete={handleRemover}
                />
              </div>
            ))}
          </div>
        )}

        <Dialog
          open={criando}
          onClose={() => setCriando(false)}
          title="Nova Unidade"
          actions={
            <>
              <Button variant="transparent" onClick={() => setCriando(false)} className="mr-2">
                Cancelar
              </Button>
              <Button onClick={handleSalvar} icon="check">
                Salvar Unidade
              </Button>
            </>
          }
        >
          <Input
            label="Nome da Unidade"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Textarea
            label="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
          />
        </Dialog>
      </Card>
    </main>
  );
}
