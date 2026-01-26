import { useState, useEffect } from "react";
import { gerarAtividade, buscarAtividadeDaUnidade, salvarAtividade, removerAtividade } from "../services";
import type { AtividadeAvaliativa } from "../models";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Textarea } from "../../../shared/components/FormFields";

type AtividadeCardProps = {
  unidade: { id: string; nome: string };
  disciplina: { nome: string; serieAno: string };
};

export function AtividadeCard({ unidade, disciplina }: AtividadeCardProps) {
  const [atividade, setAtividade] = useState<AtividadeAvaliativa | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const saved = buscarAtividadeDaUnidade(unidade.id);
    setAtividade(saved || null);
  }, [unidade.id]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const nova = await gerarAtividade({
        disciplina: disciplina.nome,
        assunto: unidade.nome,
        nivel: disciplina.serieAno,
      }, unidade.id);
      salvarAtividade(nova);
      setAtividade(nova);
    } catch (error) {
      alert("Erro ao gerar atividade.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleStartEdit() {
    if (atividade && atividade.conteudo) {
      setContent(JSON.stringify(atividade.conteudo, null, 2));
      setEditing(true);
    }
  }

  function handleSaveEdit() {
    if (atividade) {
      try {
        const conteudoObjeto = JSON.parse(content);
        const atualizada = { ...atividade, conteudo: conteudoObjeto };
        salvarAtividade(atualizada);
        setAtividade(atualizada);
        setEditing(false);
      } catch (e) {
        alert("Erro ao salvar: O formato do texto é inválido (JSON inválido). Verifique a sintaxe.");
      }
    }
  }

  function handleDelete() {
    if (confirm("Tem certeza? Isso removerá a atividade atual.")) {
      if (atividade?.id) removerAtividade(atividade.id);
      setAtividade(null);
    }
  }

  function handleDownload() {
    if (!atividade) return;
    const jsonContent = JSON.stringify(atividade.conteudo, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Atividade_${disciplina.nome}_${unidade.nome}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!atividade) {
    return (
      <Card title="Atividade Avaliativa" icon="assignment">
        <EmptyState
          title="Nenhuma atividade gerada"
          description="Gere uma atividade avaliativa baseada na unidade."
          action={
            <Button onClick={handleGenerate} loading={loading} icon="auto_awesome">
              Gerar Atividade
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card 
      title="Atividade Avaliativa" 
      icon="assignment"
      actions={
        editing ? (
          <>
            <Button variant="transparent" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </>
        ) : (
          <>
            <Button variant="border" onClick={handleDownload} icon="download">
              Baixar
            </Button>
            <Button variant="outline" onClick={handleStartEdit} icon="edit">
              Editar
            </Button>
            <Button variant="transparent" className="text-error" onClick={handleDelete} icon="delete">
              Excluir
            </Button>
          </>
        )
      }
    >
      {editing ? (
        <>
          <article className="warning mb-4">
            <div className="row">
              <i className="text-orange">warning</i>
              <div className="max">
                <strong>Atenção:</strong> Edite o conteúdo no formato JSON. Mantenha a estrutura correta.
              </div>
            </div>
          </article>
          <Textarea
            label="JSON da Atividade"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ height: "400px", fontFamily: "monospace" }}
          />
        </>
      ) : (
        <div className="surface-variant padding rounded" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <h6 className="bold">{atividade.conteudo?.title || "Atividade"}</h6>
          <p>{atividade.conteudo?.objective}</p>
          
          {atividade.conteudo?.questions?.map((q: any, i: number) => (
            <div key={i} className="card padding mb-2 white">
              <p className="bold">{i + 1}. {q.enunciado}</p>
              <div className="space"></div>
              {q.alternativas?.map((alt: string, j: number) => (
                <div key={j} className={`padding small-padding rounded mb-1 ${alt.startsWith(q.correta) ? "green lighten-4 text-green-900" : "surface"}`}>
                  {alt}
                </div>
              ))}
            </div>
          ))}

          {atividade.downloadUrl && (
            <div className="mt-4 border-top pt-2">
              <a 
                href={atividade.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="row align-center"
              >
                <i>description</i>
                <span>Baixar arquivo original (PDF/DOCX)</span>
              </a>
            </div>
          )}
          
          <div className="mt-2 text-green row align-center">
             <i className="small mr-1">check_circle</i> Salvo automaticamente
          </div>
        </div>
      )}
    </Card>
  );
}
