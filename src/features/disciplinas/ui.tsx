import { useState, type FormEvent } from "react";
import { RAG_BASE_URL } from "../../core/config/api";
import type { Disciplina } from "./models";
import { listarDisciplinas, salvarDisciplina, removerDisciplina } from "./services";
import { OPCOES_SERIES } from "./constants";
import { DisciplinaList } from "./components/DisciplinaList";
import { DisciplinaForm } from "./components/DisciplinaForm";
import {
  gerarAtividadeRemota,
  type ActivityResponse,
} from "../rag/services";
import { PageHeader } from "../../shared/components/PageHeader";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { Dialog } from "../../shared/components/Dialog";
import { Input, Select } from "../../shared/components/FormFields";

type DisciplinasPageProps = {
  onSelecionarDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinasPage({ onSelecionarDisciplina }: DisciplinasPageProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(listarDisciplinas());
  const [criando, setCriando] = useState(false);

  function handleCriarDisciplina(values: { nome: string; serieAno: string; assunto?: string }) {
    const novaDisciplina: Disciplina = {
      id: crypto.randomUUID(),
      nome: values.nome,
      serieAno: values.serieAno,
      assunto: values.assunto,
    };
    salvarDisciplina(novaDisciplina);
    setDisciplinas(listarDisciplinas());
    setCriando(false);
  }

  function handleRemoverDisciplina(disciplina: Disciplina) {
    if (confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`)) {
      removerDisciplina(disciplina.id);
      setDisciplinas(listarDisciplinas());
    }
  }

  return (
    <div className="padding">
      <PageHeader 
        title="Cultura Digital" 
        subtitle="Suas disciplinas" 
      />

      <Card 
        title="Suas Disciplinas" 
        className="mb-4"
        actions={
          <Button onClick={() => setCriando(true)} icon="add">
            Criar disciplina
          </Button>
        }
      >
        <p className="small mb-4">Gerencie suas turmas e conteúdos.</p>
        
        <Dialog
          open={criando}
          onClose={() => setCriando(false)}
          title="Nova Disciplina"
        >
          <DisciplinaForm 
            onSubmit={handleCriarDisciplina} 
            onCancel={() => setCriando(false)}
          />
        </Dialog>

        <DisciplinaList
          disciplinas={disciplinas}
          onSelectDisciplina={onSelecionarDisciplina}
          onDeleteDisciplina={handleRemoverDisciplina}
        />
      </Card>

      <Card title="Gerar atividade avaliativa com IA">
        <ActivityGeneratorCard />
      </Card>
    </div>
  );
}

type ActivityGeneratorState = {
  disciplina: string;
  assunto: string;
  nivel: string;
};

function ActivityGeneratorCard() {
  const [values, setValues] = useState<ActivityGeneratorState>({
    disciplina: "",
    assunto: "",
    nivel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ActivityResponse | null>(null);

  function handleChange(field: keyof ActivityGeneratorState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.disciplina.trim() || !values.assunto.trim() || !values.nivel.trim()) {
      setError("Preencha todos os campos antes de gerar a atividade.");
      return;
    }

    setError(null);
    setLoading(true);
    setResultado(null);

    try {
      const response = await gerarAtividadeRemota({
        disciplina: values.disciplina.trim(),
        assunto: values.assunto.trim(),
        nivel: values.nivel.trim(),
      });
      setResultado(response);
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Não foi possível gerar a atividade agora. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Disciplina"
        value={values.disciplina}
        onChange={(event) => handleChange("disciplina", event.target.value)}
        placeholder=" "
      />

      <Input
        label="Tema / Assunto da aula"
        value={values.assunto}
        onChange={(event) => handleChange("assunto", event.target.value)}
        placeholder=" "
      />

      <Select
        label="Nível / Série"
        value={values.nivel}
        onChange={(event) => handleChange("nivel", event.target.value)}
      >
        <option value="">Selecione uma série</option>
        {OPCOES_SERIES.map((grupo) => (
          <optgroup key={grupo.label} label={grupo.label}>
            {grupo.options.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      <div className="row align-center justify-end mt-4">
        {error ? <span className="error-text small margin-right">{error}</span> : null}
        <Button type="submit" loading={loading} disabled={loading}>
          Gerar atividade
        </Button>
      </div>
      
      {resultado ? (
        <div className="margin-top primary-text">
          <span className="block margin-bottom">Atividade gerada com sucesso.</span>
          <a
            href={`${RAG_BASE_URL}${resultado.download_url}`}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Baixar atividade ({resultado.filename})
          </a>
        </div>
      ) : null}
    </form>
  );
}

export default DisciplinasPage;
