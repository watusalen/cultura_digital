import { useState, useEffect } from "react";
import { gerarPlanoDeAula, buscarPlanoDaUnidade, salvarPlano, removerPlano, regenerarPdfPlano } from "../services";
import type { PlanoDeAula } from "../models";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Alert } from "../../../shared/components/Alert";
import { Input, Textarea } from "../../../shared/components/FormFields";

type PlanoAulaCardProps = {
  unidade: { id: string; nome: string; descricao?: string };
  disciplina: { nome: string; serieAno: string };
};

export function PlanoAulaCard({ unidade, disciplina }: PlanoAulaCardProps) {
  const [plano, setPlano] = useState<PlanoDeAula | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const saved = buscarPlanoDaUnidade(unidade.id);
    setPlano(saved || null);
  }, [unidade.id]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const response: any = await gerarPlanoDeAula({
        disciplina: disciplina.nome,
        serieAno: disciplina.serieAno,
        unidade: unidade.nome,
        descricao: unidade.descricao ?? "",
      }, unidade.id);
      
      const novoPlano: PlanoDeAula = {
          id: response.id || crypto.randomUUID(),
          unidadeId: unidade.id,
          conteudo: response.conteudo,
          downloadUrl: response.downloadUrl,
          filename: response.filename,
          dataGeracao: new Date().toISOString()
      };
      
      salvarPlano(novoPlano);
      setPlano(novoPlano);
    } catch (error) {
      alert("Erro ao gerar plano de aula.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleStartEdit() {
    if (plano) {
      setEditData({ ...plano.conteudo });
      setEditing(true);
    }
  }

  async function handleSaveEdit() {
      if (!plano || !editData) return;
      setLoading(true);
      try {
          // Regenerar PDF
          const response = await regenerarPdfPlano(editData);
          
          const updatedPlano: PlanoDeAula = {
              ...plano,
              conteudo: editData,
              downloadUrl: response.download_url,
              filename: response.filename,
              dataGeracao: new Date().toISOString()
          };

          salvarPlano(updatedPlano);
          setPlano(updatedPlano);
          setEditing(false);
      } catch (error) {
          alert("Erro ao salvar alterações e gerar PDF.");
          console.error(error);
      } finally {
          setLoading(false);
      }
  }

  function handleDelete() {
    if (confirm("Tem certeza? Isso removerá o plano atual.")) {
      if (plano?.id) removerPlano(plano.id);
      setPlano(null);
      setEditing(false);
    }
  }

  function handleDownload() {
    if (!plano?.downloadUrl) {
        alert("Erro: URL de download não encontrada. Tente editar e salvar para gerar um novo PDF.");
        return;
    }
    window.open(`http://localhost:8000${plano.downloadUrl}`, "_blank");
  }

  // --- Renderização do Formulário de Edição ---
  function renderEditForm() {
      if (!editData) return null;

      const handleChange = (field: string, value: any) => {
          setEditData((prev: any) => ({ ...prev, [field]: value }));
      };

      const handleArrayChange = (field: string, index: number, value: string) => {
          const newArray = [...(editData[field] || [])];
          newArray[index] = value;
          handleChange(field, newArray);
      };

      const addItem = (field: string) => {
          handleChange(field, [...(editData[field] || []), ""]);
      }

      const removeItem = (field: string, index: number) => {
           const newArray = [...(editData[field] || [])];
           newArray.splice(index, 1);
           handleChange(field, newArray);
      }

      return (
          <div className="surface-variant padding rounded" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Input label="Título" value={editData.titulo} onChange={(e) => handleChange("titulo", e.target.value)} className="mb-2" />
              
              <div className="grid">
                  <div className="s6">
                      <Input label="Duração" value={editData.duracao} onChange={(e) => handleChange("duracao", e.target.value)} />
                  </div>
                  <div className="s6">
                      <Input label="Série/Ano" value={editData.serieAno} onChange={(e) => handleChange("serieAno", e.target.value)} />
                  </div>
              </div>

              <h6 className="bold mt-2">Objetivos</h6>
              {editData.objetivos?.map((obj: string, i: number) => (
                  <div key={i} className="row align-center mb-1">
                      <Input label={`Objetivo ${i+1}`} value={obj} onChange={(e) => handleArrayChange("objetivos", i, e.target.value)} className="max" />
                      <Button variant="transparent" icon="delete" onClick={() => removeItem("objetivos", i)} className="text-error" />
                  </div>
              ))}
              <Button variant="border" onClick={() => addItem("objetivos")} icon="add">Adicionar Objetivo</Button>

              <h6 className="bold mt-2">Habilidades BNCC</h6>
               {editData.bncc?.map((skill: string, i: number) => (
                  <div key={i} className="row align-center mb-1">
                      <Input label={`Habilidade ${i+1}`} value={skill} onChange={(e) => handleArrayChange("bncc", i, e.target.value)} className="max" />
                       <Button variant="transparent" icon="delete" onClick={() => removeItem("bncc", i)} className="text-error" />
                  </div>
              ))}
               <Button variant="border" onClick={() => addItem("bncc")} icon="add">Adicionar Habilidade</Button>


              <h6 className="bold mt-2">Estratégias</h6>
               {editData.estrategias?.map((step: string, i: number) => (
                  <div key={i} className="row align-center mb-1">
                      <Textarea label={`Passo ${i+1}`} value={step} onChange={(e) => handleArrayChange("estrategias", i, e.target.value)} className="max" />
                       <Button variant="transparent" icon="delete" onClick={() => removeItem("estrategias", i)} className="text-error" />
                  </div>
              ))}
               <Button variant="border" onClick={() => addItem("estrategias")} icon="add">Adicionar Estratégia</Button>

              <Textarea label="Avaliação" value={editData.avaliacao} onChange={(e) => handleChange("avaliacao", e.target.value)} className="mt-2" />
          </div>
      );
  }

  if (!plano) {
    return (
      <Card title="Plano de Aula" icon="description">
        <EmptyState
          title="Nenhum plano de aula gerado"
          description="Gere um plano de aula completo com IA, alinhado à BNCC."
          action={
            <Button onClick={handleGenerate} loading={loading} icon="auto_awesome">
              Gerar Plano de Aula
            </Button>
          }
        />
      </Card>
    );
  }

  // Se o plano for antigo (string), força limpar para gerar novo (ou poderia converter)
  if (typeof plano.conteudo === "string") {
      return (
           <Card title="Plano de Aula (Versão Antiga)" icon="warning">
               <div className="padding error-text">
                   Este plano está em um formato antigo. Por favor, exclua e gere novamente.
               </div>
               <Button onClick={handleDelete} className="error">Excluir Plano Antigo</Button>
           </Card>
      )
  }

  const data = plano.conteudo;

  return (
    <Card 
      title="Plano de Aula" 
      icon="description"
      actions={
        editing ? (
            <>
                <Button variant="transparent" onClick={() => setEditing(false)}>Cancelar</Button>
                <Button onClick={handleSaveEdit} loading={loading}>Salvar e Regenerar PDF</Button>
            </>
        ) : (
            <>
            <Button variant="border" onClick={handleDownload} icon="download">
                Baixar PDF
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
      {editing ? renderEditForm() : (
          <div className="surface-variant padding rounded" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <h5 className="mb-2">{data.titulo}</h5>
            
            <div className="grid">
            <div className="s6">
                <strong>Duração:</strong> {data.duracao}
            </div>
            <div className="s6">
                <strong>Série:</strong> {data.serieAno}
            </div>
            </div>

            <div className="divider my-2"></div>

            <h6 className="bold">Objetivos</h6>
            <ul>
            {data.objetivos?.map((obj: string, i: number) => (
                <li key={i}>{obj}</li>
            ))}
            </ul>

            <h6 className="bold mt-2">Habilidades BNCC</h6>
            {data.bncc?.map((skill: string, i: number) => (
            <Alert key={i} type="info" className="mb-1">{skill}</Alert>
            ))}

            <h6 className="bold mt-2">Estratégias</h6>
            <div className="space-y-1">
            {data.estrategias?.map((step: string, i: number) => (
                <p key={i} className="mb-1">• {step}</p>
            ))}
            </div>

            <h6 className="bold mt-2">Avaliação</h6>
            <p>{data.avaliacao}</p>

        </div>
      )}
      {!editing && (
        <div className="mt-2 text-green row align-center">
            <i className="small mr-1">check_circle</i> Gerado com sucesso
        </div>
      )}
    </Card>
  );
}
