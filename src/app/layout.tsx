import { Outlet, Link, useLocation } from "react-router-dom";
import { Alert } from "../shared/components/Alert";

export function RootLayout() {
  const location = useLocation();

  return (
    <>
      <header className="primary-container">
        <nav>
          <Link to="/" className="row align-center">
            <i className="large">book</i>
            <div className="max">
              <h5 className="no-margin">Cultura Digital</h5>
              <p className="no-margin small">Professor Assistente</p>
            </div>
          </Link>
          <div className="max"></div>
          <div className="row align-center">
            <i>school</i>
            <span>Hackathon IFPI 2026</span>
          </div>
        </nav>
      </header>

      <main className="responsive">
        {location.pathname !== "/" && (
          <nav className="breadcrumb mb-4">
            <Link to="/" className="button small transparent">
              <i>arrow_back</i>
              <span>Voltar para o início</span>
            </Link>
          </nav>
        )}
        
        <Outlet />
      </main>

      <footer className="padding surface-container-low">
        <div className="responsive center-align">
          <p>
            Desenvolvido por <strong>Vanessa Pereira</strong> e <strong>Matusalen Alves</strong>
          </p>
          <Alert type="primary" className="round padding margin-top center-align text-left">
            <p className="small no-margin">
              <strong>Nota sobre IA:</strong> Este sistema utiliza modelos de linguagem (Llama) para gerar sugestões pedagógicas baseadas na BNCC. 
              O professor deve sempre revisar o conteúdo antes de aplicá-lo em sala de aula.
            </p>
          </Alert>
        </div>
      </footer>
    </>
  );
}
