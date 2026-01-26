import { useState, useEffect } from "react";
import { gerarSlides, buscarSlidesDaUnidade, salvarSlides, removerSlides } from "../services";
import type { Slide } from "../models";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Alert } from "../../../shared/components/Alert";

type SlidesCardProps = {
  unidade: { id: string; nome: string };
};

export function SlidesCard({ unidade }: SlidesCardProps) {
  const [slides, setSlides] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = buscarSlidesDaUnidade(unidade.id);
    setSlides(saved || null);
  }, [unidade.id]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const novo = await gerarSlides({
        topic: unidade.nome,
        slides_count: 5
      }, unidade.id);
      salvarSlides(novo);
      setSlides(novo);
    } catch (error) {
      alert("Erro ao gerar slides.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete() {
    if (confirm("Tem certeza? Isso removerá os slides salvos.")) {
      if (slides?.id) removerSlides(slides.id);
      setSlides(null);
    }
  }

  if (!slides) {
    return (
      <Card title="Slides de Apoio" icon="slideshow">
        <EmptyState
          title="Nenhum slide gerado"
          description="Gere uma apresentação de slides automática."
          action={
            <Button onClick={handleGenerate} loading={loading} icon="auto_awesome">
              Gerar Slides
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card 
      title="Slides de Apoio" 
      icon="slideshow"
      actions={
        <Button variant="transparent" className="text-error" onClick={handleDelete} icon="delete">
          Excluir Slides
        </Button>
      }
    >
      <Alert type="success" title="Slides Gerados com Sucesso!" className="mb-4">
        <p className="no-margin">Sua apresentação foi criada e está pronta para uso.</p>
      </Alert>

      <div className="grid">
        {slides.edit_url && (
          <div className="s12 m4">
            <a 
              href={slides.edit_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="button responsive fill blue"
            >
              <i>desktop_windows</i>
              <span>Visualizar Online</span>
            </a>
          </div>
        )}
        
        {slides.pptx_url && (
          <div className="s12 m4">
            <a 
              href={slides.pptx_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="button responsive fill orange"
            >
              <i>save</i>
              <span>Baixar .PPTX</span>
            </a>
          </div>
        )}

        {slides.pdf_url && (
          <div className="s12 m4">
            <a 
              href={slides.pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="button responsive fill red"
            >
              <i>picture_as_pdf</i>
              <span>Baixar PDF</span>
            </a>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-green row align-center">
          <i className="small mr-1">check_circle</i> Salvo automaticamente
      </div>
    </Card>
  );
}